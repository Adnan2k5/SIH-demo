from fastapi import APIRouter
from app.schemas.advisory import AdvisoryRequest, AdvisoryResponse
from app.services.advisory import AdvisoryService
import os

router = APIRouter()
advisory_service = AdvisoryService(api_key=os.getenv("GROQ_API_KEY"))

@router.post("/analyze", response_model=AdvisoryResponse)
def analyze_business(request: AdvisoryRequest):
    return advisory_service.analyze(request)
