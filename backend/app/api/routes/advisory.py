from fastapi import APIRouter
from app.schemas.advisory import AdvisoryRequest, AdvisoryResponse
from app.services.advisory import AdvisoryService
from app.core.rag_engine import get_rag_engine

router = APIRouter()


def _get_service() -> AdvisoryService:
    return AdvisoryService(engine=get_rag_engine())


@router.post("/analyze", response_model=AdvisoryResponse)
def analyze_business(request: AdvisoryRequest):
    return _get_service().analyze(request)
