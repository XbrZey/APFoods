from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)  # "user" or "admin"
    created_at = Column(DateTime, default=datetime.utcnow)

class Reservation(Base):
    __tablename__ = "reservations"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    date = Column(String, nullable=False)  
    booking_type = Column(String, nullable=False)  
    dynamic_selection = Column(String, nullable=False)
    time_slot = Column(String, nullable=False)
    special_requests = Column(Text, nullable=True)
    seat_number = Column(Integer, nullable=True)
    hall_number = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)  
    name = Column(String, nullable=False)                    
    sender = Column(String, default="user")                  
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

SEAT_RANGE = range(1, 21)
HALL_RANGE = range(1, 5)