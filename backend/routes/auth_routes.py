import os
import bcrypt  # Swapped passlib for native bcrypt
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database import get_db
from models.models import User, Reservation, Message

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-fallback-secret-key-for-local-dev")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin", auto_error=False)

router = APIRouter(prefix="/api", tags=["Auth & Admin Operations"])

# ─── PYDANTIC SCHEMAS ─────────────────────────────────────────────────
class SignUpRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

# ─── NATIVE BCRYPT HASHING LOGIC ──────────────────────────────────────
def get_password_hash(password: str) -> str:
    # Convert password string to bytes, salt it, and hash it
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')  # Store cleanly as a string in database

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Compare raw input against stored db hash
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

# ─── AUTHENTICATION HELPERS ───────────────────────────────────────────
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def require_admin_role(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Administrative authorization credentials required."
        )
    return current_user

# ─── USER AUTHENTICATION ENDPOINTS ────────────────────────────────────

@router.post("/auth/signup", status_code=status.HTTP_201_CREATED)
def signup(user_data: SignUpRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )
    
    hashed_pwd = get_password_hash(user_data.password)
    
    # 💡 Rule: Automatically elevate this specific address to admin status
    assigned_role = "admin" if user_data.email == "admin@apfoods.com" else "user"
    
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_pwd,
        role=assigned_role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Include both 'sub' and 'role' in the JWT payload for the frontend navbar
    token = create_access_token(data={"sub": new_user.email, "role": new_user.role})
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": {"full_name": new_user.full_name, "email": new_user.email, "role": new_user.role}
    }

@router.post("/auth/signin")
def signin(credentials: SignInRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    # Include both 'sub' and 'role' in the JWT payload for the frontend navbar
    token = create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": {"full_name": user.full_name, "email": user.email, "role": user.role}
    }

# ─── PROTECTED ADMIN ENDPOINTS ────────────────────────────────────────

@router.get("/reservations")
def get_admin_reservations(db: Session = Depends(get_db), admin=Depends(require_admin_role)):
    return db.query(Reservation).all()

@router.get("/messages")
def get_admin_messages(db: Session = Depends(get_db), admin=Depends(require_admin_role)):
    return db.query(Message).all()