from pydantic import BaseModel
from typing import Optional
from app.schemas.advisory import AdvisoryResponse
from app.schemas.finance import FinanceResponse
from app.schemas.scheme import SchemeResponse

class ReportRequest(BaseModel):
    business_name: str
    owner_name: str
    advisory_data: AdvisoryResponse
    finance_data: FinanceResponse
    scheme_data: SchemeResponse
