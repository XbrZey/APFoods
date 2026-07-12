from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes.route import router

# Creates tables if they don't exist yet. Fine for early development;
# switch to Alembic migrations before this goes to production.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="APFoods API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",  # any local dev port, either host
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def health_check():
    return {"status": "ok"}