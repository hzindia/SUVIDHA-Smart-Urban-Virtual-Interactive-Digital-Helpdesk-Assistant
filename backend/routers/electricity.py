"""
Electricity Service Router
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import secrets

router = APIRouter()


# ─── Schemas ─────────────────────────────────────────────────────────────────

class BillPayRequest(BaseModel):
    consumer_no:    str
    amount:         float  = Field(..., gt=0)
    payment_method: Literal["UPI","DEBIT_CARD","CREDIT_CARD","NET_BANKING","CASH"]

class NewConnectionRequest(BaseModel):
    applicant_name: str
    address:        str
    pin_code:       str = Field(..., min_length=6, max_length=6)
    connection_type: Literal["DOMESTIC","COMMERCIAL","INDUSTRIAL"]
    load_kw:        float = Field(..., gt=0, le=500)

class ComplaintRequest(BaseModel):
    consumer_no: str
    category:    Literal["NO_SUPPLY","BILLING_ERROR","METER_FAULT","NEW_CONN_DELAY","STAFF","OTHER"]
    description: str  = Field(..., min_length=10)
    callback_slot: Optional[str] = None

class MeterReadingRequest(BaseModel):
    meter_no:     str
    reading_kwh:  float = Field(..., ge=0)
    reading_date: Optional[str] = None

class OutageReportRequest(BaseModel):
    area:         str
    description:  str
    contact_no:   Optional[str] = None


def _ref() -> str:
    return "ELEC-" + secrets.token_hex(4).upper()


# ─── Endpoints ───────────────────────────────────────────────────────────────

@router.get("/bill/{consumer_no}", summary="Fetch outstanding bill")
async def get_bill(consumer_no: str):
    # Stub — replace with actual DB query
    return {
        "consumer_no":  consumer_no,
        "name":         "Rajesh Kumar",
        "amount_due":   1284.50,
        "units_consumed": 412,
        "bill_date":    "2026-03-01",
        "due_date":     "2026-03-31",
        "status":       "UNPAID",
    }


@router.post("/bill/pay", summary="Process bill payment")
async def pay_bill(req: BillPayRequest):
    ref = _ref()
    # Integrate payment gateway (Razorpay / PayU / BharatPe) here
    return {
        "reference_no":  ref,
        "consumer_no":   req.consumer_no,
        "amount_paid":   req.amount,
        "payment_method":req.payment_method,
        "status":        "SUCCESS",
        "timestamp":     datetime.utcnow().isoformat(),
    }


@router.post("/new-connection", summary="Apply for new connection")
async def new_connection(req: NewConnectionRequest):
    ref = _ref()
    return {
        "reference_no":     ref,
        "applicant":        req.applicant_name,
        "connection_type":  req.connection_type,
        "estimated_days":   7,
        "status":           "SUBMITTED",
        "timestamp":        datetime.utcnow().isoformat(),
    }


@router.post("/complaint", summary="Lodge electricity complaint")
async def lodge_complaint(req: ComplaintRequest):
    ref = _ref()
    return {
        "reference_no": ref,
        "category":     req.category,
        "expected_resolution": "24-48 hours",
        "status":       "REGISTERED",
        "timestamp":    datetime.utcnow().isoformat(),
    }


@router.post("/meter-reading", summary="Submit meter reading")
async def submit_meter_reading(req: MeterReadingRequest):
    return {
        "meter_no":     req.meter_no,
        "reading_kwh":  req.reading_kwh,
        "accepted":     True,
        "timestamp":    datetime.utcnow().isoformat(),
    }


@router.post("/outage-report", summary="Report power outage")
async def report_outage(req: OutageReportRequest):
    ref = _ref()
    return {
        "reference_no": ref,
        "area":         req.area,
        "status":       "REPORTED",
        "timestamp":    datetime.utcnow().isoformat(),
    }


@router.get("/status/{reference_no}", summary="Check application/complaint status")
async def check_status(reference_no: str):
    return {
        "reference_no": reference_no,
        "status":       "IN_PROGRESS",
        "last_updated": datetime.utcnow().isoformat(),
        "remarks":      "Field engineer assigned.",
    }
