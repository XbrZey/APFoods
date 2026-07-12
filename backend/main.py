from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.routes import router
from database import engine, Base

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # REMOVED the trailing slash from the production Vercel URL
    allow_origins=[
        "http://localhost:3000",
        "https://a-p-foods-resturant.vercel.app", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
Base.metadata.create_all(bind=engine)