import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.rag_engine import init_rag_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize shared resources on startup."""
    logger.info("Initializing RAG engine with Groq (llama-3.1-8b-instant)...")
    init_rag_engine(api_key=settings.groq_api_key)
    logger.info("RAG engine ready. All three vector stores loaded.")
    yield
    logger.info("Shutting down.")


app = FastAPI(title=settings.service_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
