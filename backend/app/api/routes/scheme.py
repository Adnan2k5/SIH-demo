from fastapi import APIRouter
from app.schemas.scheme import SchemeRequest, SchemeResponse
from app.services.scheme import SchemeService
from app.core.rag_engine import get_rag_engine

router = APIRouter()


def _get_service() -> SchemeService:
    return SchemeService(engine=get_rag_engine())


@router.post("/route", response_model=SchemeResponse)
def route_scheme(request: SchemeRequest):
    return _get_service().route(request)
