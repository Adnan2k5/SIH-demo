from pydantic import BaseModel, Field

class AdvisoryRequest(BaseModel):
    business_type: str = Field(..., description="Type of the business")
    location: str = Field(..., description="Location of the business")
    target_audience: str = Field(..., description="Target audience description")
    unique_selling_proposition: str = Field(..., description="USP of the business")

class AdvisoryResponse(BaseModel):
    market_reach: str
    opportunities: list[str]
    swot_analysis: dict[str, list[str]]
    pricing_strategy: str
    competitor_analysis: str
