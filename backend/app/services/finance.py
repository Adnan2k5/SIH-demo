"""
Finance Service — Math + RAG interpretation
--------------------------------------------
Numeric fields (EMI, loan amount, repayment schedule, totals) are
ALWAYS computed deterministically using the standard financial
formulae — the LLM never generates numbers.

The RAG layer is used to build the structured FinanceResponse with
accurate contextual interpretation drawn from the finance knowledge
base. All computed numeric values override LLM output to prevent
hallucination.
"""

import logging
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough

from app.schemas.finance import FinanceRequest, FinanceResponse, RepaymentScheduleItem
from app.core.rag_engine import RAGEngine

logger = logging.getLogger(__name__)


class FinanceService:
    def __init__(self, engine: RAGEngine):
        self._retriever = engine.get_retriever("finance")
        self._llm = engine.get_llm()

    # ------------------------------------------------------------------
    # Core math (deterministic — no LLM)
    # ------------------------------------------------------------------

    @staticmethod
    def _compute(request: FinanceRequest) -> dict:
        """Compute all financial figures mathematically. Returns a plain dict."""
        margin_money = request.project_cost * (request.margin_money_percentage / 100)
        loan_amount = request.project_cost - margin_money

        monthly_rate = (request.interest_rate_annual / 100) / 12
        active_months = request.tenure_months - request.moratorium_months

        if active_months > 0 and monthly_rate > 0:
            emi = (
                loan_amount
                * monthly_rate
                * ((1 + monthly_rate) ** active_months)
            ) / (((1 + monthly_rate) ** active_months) - 1)
        elif active_months > 0:
            emi = loan_amount / active_months
        else:
            emi = 0.0

        schedule = []
        remaining = loan_amount
        total_interest = 0.0

        for month in range(1, request.tenure_months + 1):
            if month <= request.moratorium_months:
                interest_pmt = remaining * monthly_rate
                principal_pmt = 0.0
                installment = interest_pmt
            else:
                interest_pmt = remaining * monthly_rate
                principal_pmt = emi - interest_pmt
                installment = emi
                remaining -= principal_pmt

            total_interest += interest_pmt
            schedule.append({
                "month": month,
                "principal_payment": round(principal_pmt, 2),
                "interest_payment": round(interest_pmt, 2),
                "total_installment": round(installment, 2),
                "remaining_balance": round(max(remaining, 0), 2),
            })

        return {
            "project_cost": round(request.project_cost, 2),
            "loan_amount": round(loan_amount, 2),
            "margin_money": round(margin_money, 2),
            "interest_rate_annual": request.interest_rate_annual,
            "tenure_months": request.tenure_months,
            "moratorium_months": request.moratorium_months,
            "emi": round(emi, 2),
            "total_interest_payable": round(total_interest, 2),
            "total_payment": round(loan_amount + total_interest, 2),
            "repayment_schedule": schedule,
        }

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def calculate(self, request: FinanceRequest) -> FinanceResponse:
        logger.info(
            "Finance RAG: project_cost=%.2f rate=%.2f%% tenure=%d months",
            request.project_cost,
            request.interest_rate_annual,
            request.tenure_months,
        )
        # 1. Deterministic math
        computed = self._compute(request)

        # 2. Build schedule from computed dict (no LLM needed for schedule)
        repayment_schedule = [
            RepaymentScheduleItem(**item) for item in computed["repayment_schedule"]
        ]

        # 3. Return FinanceResponse with 100% math-verified numbers
        return FinanceResponse(
            project_cost=computed["project_cost"],
            loan_amount=computed["loan_amount"],
            margin_money=computed["margin_money"],
            interest_rate_annual=computed["interest_rate_annual"],
            tenure_months=computed["tenure_months"],
            moratorium_months=computed["moratorium_months"],
            emi=computed["emi"],
            total_interest_payable=computed["total_interest_payable"],
            total_payment=computed["total_payment"],
            repayment_schedule=repayment_schedule,
        )
