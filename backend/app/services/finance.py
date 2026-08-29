from app.schemas.finance import FinanceRequest, FinanceResponse, RepaymentScheduleItem

class FinanceService:
    def calculate(self, request: FinanceRequest) -> FinanceResponse:
        margin_money = request.project_cost * (request.margin_money_percentage / 100)
        loan_amount = request.project_cost - margin_money
        
        monthly_interest_rate = (request.interest_rate_annual / 100) / 12
        active_tenure_months = request.tenure_months - request.moratorium_months
        
        if active_tenure_months > 0 and monthly_interest_rate > 0:
            emi = (loan_amount * monthly_interest_rate * ((1 + monthly_interest_rate) ** active_tenure_months)) / (((1 + monthly_interest_rate) ** active_tenure_months) - 1)
        elif active_tenure_months > 0:
            emi = loan_amount / active_tenure_months
        else:
            emi = 0

        schedule = []
        remaining_balance = loan_amount
        total_interest = 0

        for month in range(1, request.tenure_months + 1):
            if month <= request.moratorium_months:
                interest_payment = remaining_balance * monthly_interest_rate
                principal_payment = 0
                total_installment = interest_payment
            else:
                interest_payment = remaining_balance * monthly_interest_rate
                principal_payment = emi - interest_payment
                total_installment = emi
                remaining_balance -= principal_payment

            total_interest += interest_payment
            
            schedule.append(RepaymentScheduleItem(
                month=month,
                principal_payment=round(principal_payment, 2),
                interest_payment=round(interest_payment, 2),
                total_installment=round(total_installment, 2),
                remaining_balance=round(max(remaining_balance, 0), 2)
            ))

        return FinanceResponse(
            project_cost=round(request.project_cost, 2),
            loan_amount=round(loan_amount, 2),
            margin_money=round(margin_money, 2),
            interest_rate_annual=request.interest_rate_annual,
            tenure_months=request.tenure_months,
            moratorium_months=request.moratorium_months,
            emi=round(emi, 2),
            total_interest_payable=round(total_interest, 2),
            total_payment=round(loan_amount + total_interest, 2),
            repayment_schedule=schedule
        )
