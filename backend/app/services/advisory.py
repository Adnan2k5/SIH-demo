from typing import Dict, List
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.schemas.advisory import AdvisoryRequest, AdvisoryResponse

class AdvisoryService:
    def __init__(self, api_key: str = None):
        self.llm = ChatOpenAI(temperature=0.7, model="gpt-4o-mini", api_key=api_key) if api_key else None
        self.parser = JsonOutputParser(pydantic_object=AdvisoryResponse)
        self.prompt = PromptTemplate(
            template="Analyze the following business and provide a response in JSON format matching the schema.\n{format_instructions}\n\nBusiness Type: {business_type}\nLocation: {location}\nTarget Audience: {target_audience}\nUSP: {unique_selling_proposition}\n",
            input_variables=["business_type", "location", "target_audience", "unique_selling_proposition"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()},
        )
        if self.llm:
            self.chain = self.prompt | self.llm | self.parser
        else:
            self.chain = None

    def analyze(self, request: AdvisoryRequest) -> AdvisoryResponse:
        if not self.chain:
            return AdvisoryResponse(
                market_reach=f"Estimated reach in {request.location} for {request.business_type} is 50,000 potential customers.",
                opportunities=["Local partnerships", "Online marketing expansion", "Niche product offerings"],
                swot_analysis={
                    "Strengths": [request.unique_selling_proposition, "Local knowledge"],
                    "Weaknesses": ["Initial capital constraint", "Brand awareness"],
                    "Opportunities": ["Growing market demand in " + request.location],
                    "Threats": ["Established competitors", "Economic fluctuations"]
                },
                pricing_strategy="Value-based pricing recommended.",
                competitor_analysis="Moderate competition in the area. Focus on USP for differentiation."
            )
        
        result = self.chain.invoke({
            "business_type": request.business_type,
            "location": request.location,
            "target_audience": request.target_audience,
            "unique_selling_proposition": request.unique_selling_proposition
        })
        return AdvisoryResponse(**result)
