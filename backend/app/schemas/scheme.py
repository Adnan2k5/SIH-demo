from pydantic import BaseModel
from typing import Optional

class SchemeRequest(BaseModel):
    project_cost: float
    category: Optional[str] = None
    social_category: Optional[str] = None
    gender: Optional[str] = None

class SchemeDetails(BaseModel):
    name: str
    type: str
    max_loan_amount: float
    subsidy_percentage: float
    description: str

class SchemeResponse(BaseModel):
    recommended_scheme: SchemeDetails
    eligible_schemes: list[SchemeDetails]
