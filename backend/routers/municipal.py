"""
Municipal Services Router
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal
from datetime import datetime
import secrets

router = APIRouter()

def _ref(): return "MUN-" + secrets.token_hex(4).upper()


class PropertyTaxPay(BaseModel):
    property_no: str
    amount: float
    payment_method: str

class CertificateRequest(BaseModel):
    full_name: str
    event_date: str
    father_name: str
    hospital: str
    cert_type: Literal["BIRTH","DEATH"]

class TradeLicenseRequest(BaseModel):
    business_name: str
    business_type: str
    address: str
    owner_name: str

class MunicipalComplaint(BaseModel):
    category: Literal["GARBAGE","ROAD","DRAINAGE","ENCROACHMENT","NOISE","OTHER"]
    location: str
    description: str


@router.get("/property-tax/{property_no}")
async def get_property_tax(property_no: str):
    return {"property_no": property_no, "owner": "Rajesh Kumar",
            "amount_due": 2800.00, "year": "2025-26",
            "due_date": "2026-03-31", "status": "PENDING"}

@router.post("/property-tax/pay")
async def pay_property_tax(req: PropertyTaxPay):
    return {"reference_no": _ref(), "property_no": req.property_no,
            "amount_paid": req.amount, "status": "SUCCESS",
            "receipt_url": f"/receipts/{_ref()}.pdf",
            "timestamp": datetime.utcnow().isoformat()}

@router.post("/certificate/request")
async def request_certificate(req: CertificateRequest):
    return {"reference_no": _ref(), "cert_type": req.cert_type,
            "applicant": req.full_name, "status": "SUBMITTED",
            "estimated_days": 5, "timestamp": datetime.utcnow().isoformat()}

@router.post("/trade-license/apply")
async def apply_trade_license(req: TradeLicenseRequest):
    return {"reference_no": _ref(), "business": req.business_name,
            "status": "SUBMITTED", "estimated_days": 15,
            "timestamp": datetime.utcnow().isoformat()}

@router.post("/complaint")
async def municipal_complaint(req: MunicipalComplaint):
    return {"reference_no": _ref(), "category": req.category,
            "status": "REGISTERED", "resolution_time": "72 hours",
            "timestamp": datetime.utcnow().isoformat()}

@router.get("/status/{reference_no}")
async def municipal_status(reference_no: str):
    return {"reference_no": reference_no, "status": "IN_PROGRESS",
            "last_updated": datetime.utcnow().isoformat()}
