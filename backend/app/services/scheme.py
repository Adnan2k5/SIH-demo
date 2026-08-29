"""
Scheme Service — RAG-powered
------------------------------
Replaces the old 3-scheme hardcoded decision tree.
The Groq LLM dynamically retrieves scheme information from the
scheme knowledge base and selects the best matching scheme for
the given request parameters (project cost, category, social
category, gender). Returns the same SchemeResponse schema.
"""

import logging
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough

from app.schemas.scheme import SchemeRequest, SchemeResponse
from app.core.rag_engine import RAGEngine

logger = logging.getLogger(__name__)


class SchemeService:
    def __init__(self, engine: RAGEngine):
        self._retriever = engine.get_retriever("scheme")
        self._llm = engine.get_llm()
        self._parser = JsonOutputParser(pydantic_object=SchemeResponse)

        self._prompt = PromptTemplate(
            template=(
                "You are an expert on Indian government loan schemes for MSMEs and entrepreneurs.\n"
                "Use ONLY the retrieved context below to identify the most suitable schemes.\n"
                "Respond STRICTLY in the JSON format described by the format instructions.\n\n"
                "{format_instructions}\n\n"
                "=== Retrieved Scheme Information ===\n"
                "{context}\n\n"
                "=== Applicant Details ===\n"
                "Project Cost      : ₹{project_cost}\n"
                "Business Category : {category}\n"
                "Social Category   : {social_category}\n"
                "Gender            : {gender}\n\n"
                "CRITICAL: Your JSON response MUST include ALL of the following keys:\n"
                "  1. recommended_scheme — The single BEST matching scheme given all parameters.\n"
                "  2. eligible_schemes   — ALL schemes the applicant is eligible for (include recommended).\n"
                "For each scheme include: name, type, max_loan_amount (number in INR, no symbols),\n"
                "subsidy_percentage (number, e.g. 35.0 for 35%, use 0.0 if none), description.\n"
                "Use exact scheme names from the context (e.g. 'MUDRA Tarun', 'PMEGP', 'Stand-Up India').\n"
                "Omitting any key is NOT allowed. Return ONLY valid JSON. No markdown, no text outside the JSON.\n"
            ),
            input_variables=[
                "context",
                "project_cost",
                "category",
                "social_category",
                "gender",
            ],
            partial_variables={"format_instructions": self._parser.get_format_instructions()},
        )

        # Separate LLM chain so we can log the raw text before parsing
        self._llm_chain = (
            RunnablePassthrough.assign(
                context=lambda x: self._retrieve_context(x)
            )
            | self._prompt
            | self._llm
        )

    def _retrieve_context(self, inputs: dict) -> str:
        query = (
            f"Indian government loan scheme project cost {inputs['project_cost']} "
            f"category {inputs['category']} social category {inputs['social_category']} "
            f"gender {inputs['gender']} MUDRA PMEGP Stand-Up India eligibility subsidy"
        )
        docs = self._retriever.invoke(query)
        return "\n\n".join(doc.page_content for doc in docs)

    def _parse_with_retry(self, inputs: dict, max_retries: int = 2) -> dict:
        """Invoke LLM and parse JSON; retry up to max_retries times on failure."""
        last_exc = None
        for attempt in range(1, max_retries + 2):
            raw = self._llm_chain.invoke(inputs)
            text = raw.content if hasattr(raw, "content") else str(raw)
            logger.debug("Scheme LLM raw output (attempt %d): %r", attempt, text[:500])
            if not text.strip():
                logger.warning("Scheme LLM returned empty response on attempt %d", attempt)
                last_exc = ValueError("LLM returned empty response")
                continue
            try:
                return self._parser.parse(text)
            except Exception as exc:
                logger.warning(
                    "Scheme JSON parse failed on attempt %d: %s | raw=%r",
                    attempt, exc, text[:300],
                )
                last_exc = exc
        raise last_exc

    def route(self, request: SchemeRequest) -> SchemeResponse:
        logger.info(
            "Scheme RAG: project_cost=%.2f category=%s social_category=%s gender=%s",
            request.project_cost,
            request.category,
            request.social_category,
            request.gender,
        )
        inputs = {
            "project_cost": f"{request.project_cost:,.0f}",
            "category": request.category or "General",
            "social_category": request.social_category or "General",
            "gender": request.gender or "Not specified",
        }
        result = self._parse_with_retry(inputs)
        return SchemeResponse(**result)
