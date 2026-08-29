from typing import Optional
from pydantic import BaseModel, Field

class AdvisoryRequest(BaseModel):
    business_type: str = Field(..., description="Type of the business")
    location: str = Field(..., description="Location of the business")
    target_audience: str = Field(..., description="Target audience description")
    unique_selling_proposition: str = Field(..., description="USP of the business")

class AdvisoryResponse(BaseModel):
    market_reach: str = Field(default="", description="Estimated potential customer base")
    opportunities: list[str] = Field(default_factory=list, description="Growth opportunities")
    swot_analysis: Optional[dict[str, list[str]]] = Field(
        default=None,
        description="SWOT analysis with keys: strengths, weaknesses, opportunities, threats",
    )
    pricing_strategy: Optional[str] = Field(
        default=None,
        description="Recommended pricing approach with justification",
    )
    competitor_analysis: Optional[str] = Field(
        default=None,
        description="Key competitors and differentiation tactics",
    )
