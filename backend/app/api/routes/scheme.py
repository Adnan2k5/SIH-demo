from fastapi import APIRouter
from app.schemas.scheme import SchemeRequest, SchemeResponse
from app.services.scheme import SchemeService

router = APIRouter()
scheme_service = SchemeService()

@router.post("/route", response_model=SchemeResponse)
def route_scheme(request: SchemeRequest):
    return scheme_service.route(request)
