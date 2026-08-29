from pydantic import BaseModel
from typing import List

class FinanceRequest(BaseModel):
    project_cost: float
    margin_money_percentage: float = 20.0
    interest_rate_annual: float
    tenure_months: int
    moratorium_months: int = 0

class RepaymentScheduleItem(BaseModel):
    month: int
    principal_payment: float
    interest_payment: float
    total_installment: float
    remaining_balance: float

class FinanceResponse(BaseModel):
    project_cost: float
    loan_amount: float
    margin_money: float
    interest_rate_annual: float
    tenure_months: int
    moratorium_months: int
    emi: float
    total_interest_payable: float
    total_payment: float
    repayment_schedule: List[RepaymentScheduleItem]
