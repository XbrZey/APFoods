from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Dict
import json

from database import get_db
from models.models import Reservation, Message, SEAT_RANGE, HALL_RANGE
from schemas.schemas import ReservationCreate, ReservationOut, MessageCreate, MessageOut

router = APIRouter(prefix="/api")

# --- In-Memory WebSocket Connection Management ---
class ConnectionManager:
    def __init__(self):
        # Maps client_id (e.g., "admin" or a customer's unique session_id string) to WebSocket objects
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        if client_id not in self.active_connections:
            self.active_connections[client_id] = []
        self.active_connections[client_id].append(websocket)

    def disconnect(self, client_id: str, websocket: WebSocket):
        if client_id in self.active_connections:
            self.active_connections[client_id].remove(websocket)
            if not self.active_connections[client_id]:
                del self.active_connections[client_id]

    async def send_personal_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            for connection in self.active_connections[client_id]:
                await connection.send_text(message)

    async def broadcast_to_admins(self, message: str):
        if "admin" in self.active_connections:
            for connection in self.active_connections["admin"]:
                await connection.send_text(message)

manager = ConnectionManager()

# --- WebSocket Endpoint ---
@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str, db: Session = Depends(get_db)):
    await manager.connect(client_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Persist incoming communication directly to PostgreSQL database
            db_msg = Message(
                session_id=payload["session_id"],
                name=payload["name"],
                sender=payload["sender"],  # Must be 'user' or 'admin'
                message=payload["message"]
            )
            db.add(db_msg)
            db.commit()
            db.refresh(db_msg)
            
            # Formulate cross-wire serialization payload
            broadcast_payload = json.dumps({
                "id": db_msg.id,
                "session_id": db_msg.session_id,
                "name": db_msg.name,
                "sender": db_msg.sender,
                "message": db_msg.message,
                "created_at": str(db_msg.created_at)
            })

            # Route messages based on who sent it
            if db_msg.sender == "admin":
                await manager.send_personal_message(broadcast_payload, db_msg.session_id)
            else:
                await manager.broadcast_to_admins(broadcast_payload)
                
    except WebSocketDisconnect:
        manager.disconnect(client_id, websocket)

# --- Allocation Helper Engine ---
def _allocate_number(db: Session, date: str, time_slot: str, booking_type: str) -> int:
    column = Reservation.seat_number if booking_type == "seat" else Reservation.hall_number
    num_range = SEAT_RANGE if booking_type == "seat" else HALL_RANGE

    taken_rows = db.query(column).filter(
        Reservation.date == date,
        Reservation.time_slot == time_slot,
        Reservation.booking_type == booking_type
    ).all()
    
    taken = {row[0] for row in taken_rows if row[0] is not None}
    
    for candidate in num_range:
        if candidate not in taken:
            return candidate

    label = "seats" if booking_type == "seat" else "halls"
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=f"All {label} are fully booked for {time_slot} on {date}."
    )

# --- Reservations REST Routes ---
@router.post("/reservations", response_model=ReservationOut, status_code=status.HTTP_201_CREATED)
def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
    allocated_number = _allocate_number(db, payload.date, payload.time_slot, payload.booking_type)
    
    db_res = Reservation(
        **payload.model_dump(),
        seat_number=allocated_number if payload.booking_type == "seat" else None,
        hall_number=allocated_number if payload.booking_type == "hall" else None
    )
    db.add(db_res)
    db.commit()
    db.refresh(db_res)
    return db_res

@router.get("/reservations", response_model=List[ReservationOut])
def list_reservations(db: Session = Depends(get_db)):
    return db.query(Reservation).order_by(Reservation.created_at.desc()).all()

@router.delete("/reservations/{res_id}", status_code=status.HTTP_200_OK)
def delete_reservation(res_id: int, db: Session = Depends(get_db)):
    res = db.query(Reservation).filter(Reservation.id == res_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found.")
    db.delete(res)
    db.commit()
    return {"ok": True}

# --- Messaging REST Fallbacks & History Retrieval ---
@router.post("/messages", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(payload: MessageCreate, db: Session = Depends(get_db)):
    db_msg = Message(**payload.model_dump())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@router.get("/messages", response_model=List[MessageOut])
def get_all_messages(db: Session = Depends(get_db)):
    return db.query(Message).order_by(Message.created_at.asc()).all()

@router.get("/messages/thread/{session_id}", response_model=List[MessageOut])
def get_conversation_thread(session_id: str, db: Session = Depends(get_db)):
    return db.query(Message).filter(Message.session_id == session_id).order_by(Message.created_at.asc()).all()