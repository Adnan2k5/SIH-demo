from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.advisory import router as advisory_router
from app.api.routes.finance import router as finance_router
from app.api.routes.scheme import router as scheme_router
from app.api.routes.report import router as report_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(advisory_router, prefix="/advisory", tags=["Advisory"])
api_router.include_router(finance_router, prefix="/finance", tags=["Finance"])
api_router.include_router(scheme_router, prefix="/scheme", tags=["Scheme"])
api_router.include_router(report_router, prefix="/report", tags=["Report"])
