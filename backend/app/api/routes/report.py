from fastapi import APIRouter, Response
from app.schemas.report import ReportRequest
from app.services.report import ReportService

router = APIRouter()
report_service = ReportService()

@router.post("/generate")
def generate_report(request: ReportRequest):
    pdf_bytes = report_service.generate(request)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={request.business_name.replace(' ', '_')}_report.pdf"}
    )
