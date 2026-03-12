"""
Water & Sanitation Router
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import secrets

router = APIRouter()

def _ref(): return "WAT-" + secrets.token_hex(4).upper()


class WaterBillPay(BaseModel):
    consumer_no: str
    amount: float
    payment_method: str

class WaterNewConn(BaseModel):
    applicant_name: str
    address: str
    connection_type: Literal["DOMESTIC","COMMERCIAL","INDUSTRIAL"]

class WaterComplaint(BaseModel):
    consumer_no: str
    category: str
    description: str

class TankerRequest(BaseModel):
    address: str
    quantity_litres: int
    preferred_date: str

class SewageRequest(BaseModel):
    address: str
    issue_type: str
    description: str


@router.get("/bill/{consumer_no}")
async def get_water_bill(consumer_no: str):
    return {"consumer_no": consumer_no, "amount_due": 512.00,
            "consumption_kl": 18.5, "due_date": "2026-03-31", "status": "UNPAID"}

@router.post("/bill/pay")
async def pay_water_bill(req: WaterBillPay):
    return {"reference_no": _ref(), "amount_paid": req.amount,
            "status": "SUCCESS", "timestamp": datetime.utcnow().isoformat()}

@router.post("/new-connection")
async def water_new_connection(req: WaterNewConn):
    return {"reference_no": _ref(), "applicant": req.applicant_name,
            "status": "SUBMITTED", "estimated_days": 14, "timestamp": datetime.utcnow().isoformat()}

@router.post("/complaint")
async def water_complaint(req: WaterComplaint):
    return {"reference_no": _ref(), "status": "REGISTERED",
            "resolution_time": "48 hours", "timestamp": datetime.utcnow().isoformat()}

@router.post("/tanker-request")
async def tanker_request(req: TankerRequest):
    return {"reference_no": _ref(), "quantity": req.quantity_litres,
            "preferred_date": req.preferred_date,
            "status": "BOOKED", "timestamp": datetime.utcnow().isoformat()}

@router.post("/sewage-request")
async def sewage_request(req: SewageRequest):
    return {"reference_no": _ref(), "issue_type": req.issue_type,
            "status": "REGISTERED", "timestamp": datetime.utcnow().isoformat()}

@router.get("/status/{reference_no}")
async def water_status(reference_no: str):
    return {"reference_no": reference_no, "status": "IN_PROGRESS",
            "last_updated": datetime.utcnow().isoformat()}
