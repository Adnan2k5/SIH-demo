from fastapi import APIRouter
from app.schemas.finance import FinanceRequest, FinanceResponse
from app.services.finance import FinanceService
from app.core.rag_engine import get_rag_engine

router = APIRouter()


def _get_service() -> FinanceService:
    return FinanceService(engine=get_rag_engine())


@router.post("/calculate", response_model=FinanceResponse)
def calculate_finance(request: FinanceRequest):
    return _get_service().calculate(request)
