from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db
from models.model import Reservation, CartItem, Message, SEAT_RANGE, HALL_RANGE
from schemas.schema import (
    ReservationCreate, ReservationOut,
    CartItemCreate, CartItemOut, CartItemQtyUpdate,
    MessageOut,
)

router = APIRouter()


# ============================================================
# Reservations
# ============================================================

def _allocate_number(db: Session, date: str, time_slot: str, booking_type: str) -> int:
    """
    Find the first free seat (1-30) or hall (1-3) for a given date + time slot.
    Raises HTTPException(409) if fully booked.
    """
    number_range = SEAT_RANGE if booking_type == "seat" else HALL_RANGE
    column = Reservation.seat_number if booking_type == "seat" else Reservation.hall_number

    taken_rows = (
        db.query(column)
        .filter(
            Reservation.date == date,
            Reservation.time_slot == time_slot,
            Reservation.booking_type == booking_type,
        )
        .all()
    )
    taken = {row[0] for row in taken_rows if row[0] is not None}

    for candidate in number_range:
        if candidate not in taken:
            return candidate

    label = "seats" if booking_type == "seat" else "halls"
    raise HTTPException(
        status_code=409,
        detail=f"All {label} are fully booked for {time_slot} on {date}. Please choose another time or date.",
    )


@router.post("/api/reservations", response_model=ReservationOut)
def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
    allocated_number = _allocate_number(db, payload.date, payload.time_slot, payload.booking_type)

    reservation = Reservation(
        name=payload.name,
        mobile=payload.mobile,
        date=payload.date,
        booking_type=payload.booking_type,
        dynamic_selection=payload.dynamic_selection,
        time_slot=payload.time_slot,
        special_requests=payload.special_requests,
        seat_number=allocated_number if payload.booking_type == "seat" else None,
        hall_number=allocated_number if payload.booking_type == "hall" else None,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


@router.get("/api/reservations", response_model=List[ReservationOut])
def list_reservations(db: Session = Depends(get_db)):
    return db.query(Reservation).order_by(Reservation.created_at.desc()).all()


@router.delete("/api/reservations/{reservation_id}")
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found.")
    db.delete(reservation)
    db.commit()
    return {"ok": True}


# ============================================================
# Cart
# ============================================================

@router.get("/api/cart", response_model=List[CartItemOut])
def list_cart(db: Session = Depends(get_db)):
    return db.query(CartItem).order_by(CartItem.created_at.desc()).all()


@router.post("/api/cart", response_model=CartItemOut)
def add_cart_item(payload: CartItemCreate, db: Session = Depends(get_db)):
    # Upsert: same session + same item -> bump quantity instead of duplicating
    existing = (
        db.query(CartItem)
        .filter(CartItem.session_id == payload.session_id, CartItem.item_name == payload.item_name)
        .first()
    )
    if existing:
        existing.qty += payload.qty
        db.commit()
        db.refresh(existing)
        return existing

    item = CartItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/api/cart/{item_id}", response_model=CartItemOut)
def update_cart_qty(item_id: int, payload: CartItemQtyUpdate, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found.")
    if payload.qty <= 0:
        db.delete(item)
        db.commit()
        return item
    item.qty = payload.qty
    db.commit()
    db.refresh(item)
    return item


@router.delete("/api/cart/{item_id}")
def remove_cart_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found.")
    db.delete(item)
    db.commit()
    return {"ok": True}


# ============================================================
# Messages
# ============================================================

@router.get("/api/messages", response_model=List[MessageOut])
def list_messages(db: Session = Depends(get_db)):
    return db.query(Message).order_by(Message.id.desc()).all()