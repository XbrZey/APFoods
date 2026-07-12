from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from database import Base

SEAT_RANGE = range(1, 31)   # seats 1-30
HALL_RANGE = range(1, 4)    # halls 1-3


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    date = Column(String, nullable=False)          # stored as ISO date string, e.g. "2026-07-20"
    booking_type = Column(String, nullable=False)   # "seat" or "hall"
    dynamic_selection = Column(String, nullable=False)  # guest count label OR occasion label
    time_slot = Column(String, nullable=False)
    special_requests = Column(Text, nullable=True)

    seat_number = Column(Integer, nullable=True)   # 1-30, set when booking_type == "seat"
    hall_number = Column(Integer, nullable=True)    # 1-3, set when booking_type == "hall"

    created_at = Column(DateTime, default=datetime.utcnow)


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)
    customer_label = Column(String, nullable=True)
    item_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    qty = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)