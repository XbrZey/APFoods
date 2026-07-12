from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel

# --- Reservations ---
class ReservationCreate(BaseModel):
    name: str
    mobile: str
    date: str
    booking_type: Literal["seat", "hall"]
    dynamic_selection: str
    time_slot: str
    special_requests: Optional[str] = None

class ReservationOut(BaseModel):
    id: int
    name: str
    mobile: str
    date: str
    booking_type: str
    dynamic_selection: str
    time_slot: str
    special_requests: Optional[str] = None
    seat_number: Optional[int] = None
    hall_number: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Messaging System ---
class MessageCreate(BaseModel):
    session_id: str
    name: str
    sender: Literal["user", "admin"] = "user"
    message: str

class MessageOut(BaseModel):
    id: int
    session_id: str
    name: str
    sender: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True