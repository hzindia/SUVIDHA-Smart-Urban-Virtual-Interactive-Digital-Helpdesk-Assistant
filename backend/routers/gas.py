"""
Gas Distribution Router
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import secrets

router = APIRouter()

def _ref(prefix="GAS"): return f"{prefix}-" + secrets.token_hex(4).upper()


class CylinderBookRequest(BaseModel):
    lpg_consumer_id: str
    distributor:     str
    delivery_type:   Literal["HOME_DELIVERY","SELF_PICKUP"]

class GasBillPay(BaseModel):
    consumer_no:     str
    amount:          float
    payment_method:  str

class GasNewConn(BaseModel):
    applicant_name:  str
    address:         str
    connection_type: Literal["DOMESTIC","COMMERCIAL"]

class GasComplaint(BaseModel):
    consumer_no: str
    category:    str
    description: str


@router.get("/bill/{consumer_no}")
async def get_gas_bill(consumer_no: str):
    return {"consumer_no": consumer_no, "amount_due": 438.00, "status": "UNPAID",
            "due_date": "2026-03-31", "cylinder_count": 1}

@router.post("/cylinder/book")
async def book_cylinder(req: CylinderBookRequest):
    return {"reference_no": _ref(), "lpg_id": req.lpg_consumer_id,
            "delivery_type": req.delivery_type, "estimated_delivery": "2-3 business days",
            "status": "BOOKED", "timestamp": datetime.utcnow().isoformat()}

@router.post("/bill/pay")
async def pay_gas_bill(req: GasBillPay):
    return {"reference_no": _ref(), "amount_paid": req.amount,
            "status": "SUCCESS", "timestamp": datetime.utcnow().isoformat()}

@router.post("/new-connection")
async def gas_new_connection(req: GasNewConn):
    return {"reference_no": _ref(), "applicant": req.applicant_name,
            "status": "SUBMITTED", "estimated_days": 10, "timestamp": datetime.utcnow().isoformat()}

@router.post("/complaint")
async def gas_complaint(req: GasComplaint):
    return {"reference_no": _ref(), "status": "REGISTERED",
            "resolution_time": "48 hours", "timestamp": datetime.utcnow().isoformat()}

@router.get("/status/{reference_no}")
async def gas_status(reference_no: str):
    return {"reference_no": reference_no, "status": "IN_PROGRESS",
            "last_updated": datetime.utcnow().isoformat()}
