from app.schemas.scheme import SchemeRequest, SchemeResponse, SchemeDetails

class SchemeService:
    def route(self, request: SchemeRequest) -> SchemeResponse:
        schemes = [
            SchemeDetails(
                name="Micro Unit Development and Refinance Agency (MUDRA)",
                type="Micro Finance",
                max_loan_amount=1000000,
                subsidy_percentage=0.0,
                description="Loans up to 10 Lakhs for non-corporate, non-farm small/micro enterprises."
            ),
            SchemeDetails(
                name="Prime Minister's Employment Generation Programme (PMEGP)",
                type="Term Loan",
                max_loan_amount=5000000,
                subsidy_percentage=35.0,
                description="Credit-linked subsidy programme for generating employment."
            ),
            SchemeDetails(
                name="Stand-Up India",
                type="Term Loan",
                max_loan_amount=10000000,
                subsidy_percentage=0.0,
                description="Loans from 10 Lakhs to 1 Crore for SC/ST and women entrepreneurs."
            )
        ]

        eligible = []
        recommended = None

        for scheme in schemes:
            if request.project_cost <= scheme.max_loan_amount:
                eligible.append(scheme)
        
        if eligible:
            if request.project_cost <= 1000000:
                recommended = next((s for s in eligible if s.type == "Micro Finance"), eligible[0])
            else:
                recommended = next((s for s in eligible if s.type == "Term Loan"), eligible[0])
        else:
            recommended = SchemeDetails(
                name="Standard Commercial Term Loan",
                type="Term Loan",
                max_loan_amount=float('inf'),
                subsidy_percentage=0.0,
                description="Standard commercial loan provided by banks for large project costs."
            )
            eligible = [recommended]

        return SchemeResponse(
            recommended_scheme=recommended,
            eligible_schemes=eligible
        )
