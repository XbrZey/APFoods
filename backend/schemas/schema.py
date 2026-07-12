from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel


# ---------- Reservations ----------

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
        from_attributes = True  # (orm_mode in pydantic v1)


# ---------- Cart ----------

class CartItemCreate(BaseModel):
    session_id: str
    customer_label: Optional[str] = None
    item_name: str
    price: float
    qty: int = 1


class CartItemQtyUpdate(BaseModel):
    qty: int


class CartItemOut(BaseModel):
    id: int
    session_id: str
    customer_label: Optional[str] = None
    item_name: str
    price: float
    qty: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Messages ----------

class MessageOut(BaseModel):
    id: int
    name: str
    subject: str
    message: str

    class Config:
        from_attributes = True