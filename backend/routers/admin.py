"""
Admin Dashboard Router - Kiosk Analytics & Management
Protected: Requires admin JWT role
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime

router  = APIRouter()
bearer  = HTTPBearer()


def _require_admin(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    """Validate admin token — replace with proper JWT role check."""
    if creds.credentials != "admin-dev-token":  # Replace with JWT validation
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin access required")
    return creds


@router.get("/dashboard", summary="Get kiosk analytics overview")
async def dashboard(admin=Depends(_require_admin)):
    return {
        "kiosk_id":    "KIOSK-PUNE-001",
        "report_date": datetime.utcnow().date().isoformat(),
        "kpis": {
            "transactions_today":  1847,
            "pending_requests":    63,
            "revenue_collected":   320000,
            "uptime_percent":      99.7,
        },
        "service_breakdown": {
            "electricity": 612,
            "gas":         441,
            "water":       398,
            "municipal":   396,
        },
        "hourly_traffic": [
            {"hour": h, "count": max(10, (h-8)**2 + 20)} for h in range(8, 21)
        ],
    }


@router.get("/activity-feed", summary="Live activity feed")
async def activity_feed(limit: int = 20, admin=Depends(_require_admin)):
    # In production: query DB ordered by timestamp DESC
    return {
        "total": 1847,
        "items": [
            {"ref": "REF-A4X92", "service": "Electricity", "task": "Bill Payment",
             "citizen": "Priya S.", "status": "SUCCESS",  "time": "2 min ago"},
            {"ref": "REF-B7K41", "service": "Water",       "task": "New Connection",
             "citizen": "Amit K.", "status": "PENDING",   "time": "5 min ago"},
            {"ref": "REF-C2P18", "service": "Gas",         "task": "Cylinder Booking",
             "citizen": "Sunita R.", "status": "SUCCESS", "time": "9 min ago"},
        ][:limit],
    }


@router.get("/kiosk-health", summary="Kiosk hardware health status")
async def kiosk_health(admin=Depends(_require_admin)):
    return {
        "kiosk_id":     "KIOSK-PUNE-001",
        "online":       True,
        "uptime_hours": 1284,
        "hardware": {
            "touchscreen":   "OK",
            "printer":       "OK",
            "card_reader":   "OK",
            "qr_scanner":    "OK",
            "biometric":     "OK",
            "network":       "4G_BACKUP",
        },
        "last_maintenance": "2026-02-15",
        "next_maintenance": "2026-04-15",
    }


@router.post("/broadcast", summary="Push notification to kiosk ticker")
async def broadcast_notification(message: str, admin=Depends(_require_admin)):
    # In production: publish to Redis pub/sub → WebSocket → kiosk UI
    return {"message": "Notification queued", "text": message,
            "timestamp": datetime.utcnow().isoformat()}
