from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.routes import router as general_router
from routes.auth_routes import router as auth_router
from database import engine, Base

app = FastAPI(title="A&P Foods Pipeline API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://a-p-foods-resturant.vercel.app", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(general_router)
app.include_router(auth_router)

Base.metadata.create_all(bind=engine)