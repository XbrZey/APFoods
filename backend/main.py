from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
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

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {exc}"},
    )

app.include_router(general_router)
app.include_router(auth_router)

# NOTE: Schema is now managed by Alembic migrations (see backend/alembic/).
# create_all() is kept ONLY as a safety net for a completely fresh/empty
# database (e.g. a new teammate's local Postgres) — it does nothing to an
# existing table, so it can never "fix" a schema mismatch. Once your DB has
# run its first migration, this line is effectively a no-op every time.
Base.metadata.create_all(bind=engine)