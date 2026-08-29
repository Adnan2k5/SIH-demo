import os
from typing import Dict, List
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.runnables import RunnablePassthrough
from app.schemas.advisory import AdvisoryRequest, AdvisoryResponse

class AdvisoryService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key
        self.llm = ChatGroq(temperature=0.7, model_name="mixtral-8x7b-32768", api_key=api_key) if api_key else None
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.parser = JsonOutputParser(pydantic_object=AdvisoryResponse)
        
        self.prompt = PromptTemplate(
            template="You are a business advisory engine. Use the retrieved context to analyze the business and provide a response in JSON format matching the schema.\n{format_instructions}\n\nContext:\n{context}\n\nBusiness Type: {business_type}\nLocation: {location}\nTarget Audience: {target_audience}\nUSP: {unique_selling_proposition}\n",
            input_variables=["context", "business_type", "location", "target_audience", "unique_selling_proposition"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()},
        )
        
        self.vector_store = None
        self.retriever = None
        
        if self.api_key:
            self._initialize_rag()
            self.chain = (
                RunnablePassthrough.assign(
                    context=lambda x: self._format_docs(self.retriever.invoke(x["business_type"] + " " + x["location"]))
                )
                | self.prompt
                | self.llm
                | self.parser
            )
        else:
            self.chain = None

    def _initialize_rag(self):
        kb_path = "backend/data/knowledge_base.txt"
        os.makedirs(os.path.dirname(kb_path), exist_ok=True)
        if not os.path.exists(kb_path):
            with open(kb_path, "w") as f:
                f.write("Market dynamics: Startups in rural areas benefit from MUDRA loans. Urban tech companies see 20% YoY growth. Manufacturing sector requires strong supply chain USPs.\n")
                
        loader = TextLoader(kb_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        splits = text_splitter.split_documents(docs)
        self.vector_store = Chroma.from_documents(documents=splits, embedding=self.embeddings)
        self.retriever = self.vector_store.as_retriever()

    def _format_docs(self, docs):
        return "\n\n".join(doc.page_content for doc in docs)

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
