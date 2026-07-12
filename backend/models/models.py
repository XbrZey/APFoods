from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base

SEAT_RANGE = range(1, 31)
HALL_RANGE = range(1, 4)

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    date = Column(String, nullable=False)  # ISO Date String: "YYYY-MM-DD"
    booking_type = Column(String, nullable=False)  # "seat" or "hall"
    dynamic_selection = Column(String, nullable=False)
    time_slot = Column(String, nullable=False)
    special_requests = Column(Text, nullable=True)
    seat_number = Column(Integer, nullable=True)
    hall_number = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)  # Groups unique user-admin threads
    name = Column(String, nullable=False)                    # User's display name
    sender = Column(String, default="user")                  # "user" or "admin"
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)