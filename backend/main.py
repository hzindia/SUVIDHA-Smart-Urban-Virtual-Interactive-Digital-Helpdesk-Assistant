"""
SUVIDHA Backend - FastAPI Application
C-DAC Smart City 2.0 | SUVIDHA Kiosk API
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn

from routers import auth, electricity, gas, water, municipal, admin
from database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="SUVIDHA API",
    description="Smart Urban Virtual Interactive Digital Helpdesk Assistant - C-DAC Smart City 2.0",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router,        prefix="/api/v1/auth",        tags=["Authentication"])
app.include_router(electricity.router, prefix="/api/v1/electricity",  tags=["Electricity"])
app.include_router(gas.router,         prefix="/api/v1/gas",          tags=["Gas"])
app.include_router(water.router,       prefix="/api/v1/water",        tags=["Water & Sanitation"])
app.include_router(municipal.router,   prefix="/api/v1/municipal",    tags=["Municipal Services"])
app.include_router(admin.router,       prefix="/api/v1/admin",        tags=["Admin"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "service": "SUVIDHA API",
        "version": "1.0.0",
        "powered_by": "C-DAC | MeitY | Government of India",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
