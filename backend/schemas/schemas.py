from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr

# --- Authentication Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Reservation Schemas ---
class ReservationCreate(BaseModel):
    name: str
    mobile: str
    date: str
    booking_type: Literal["seat", "hall"]
    dynamic_selection: str
    time_slot: str
    special_requests: Optional[str] = None
    user_id: Optional[int] = None

class ReservationOut(BaseModel):
    id: int
    user_id: Optional[int] = None
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

# --- Messaging System Schemas ---
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