from fastapi import APIRouter
from app.schemas.finance import FinanceRequest, FinanceResponse
from app.services.finance import FinanceService

router = APIRouter()
finance_service = FinanceService()

@router.post("/calculate", response_model=FinanceResponse)
def calculate_finance(request: FinanceRequest):
    return finance_service.calculate(request)
