import os
import io
from app.schemas.report import ReportRequest
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class ReportService:
    def generate(self, request: ReportRequest) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
        
        styles = getSampleStyleSheet()
        title_style = styles['Heading1']
        heading_style = styles['Heading2']
        normal_style = styles['Normal']
        
        elements = []
        
        elements.append(Paragraph(f"Business Plan & Financial Report", title_style))
        elements.append(Spacer(1, 12))
        
        elements.append(Paragraph(f"Business Name: {request.business_name}", normal_style))
        elements.append(Paragraph(f"Owner Name: {request.owner_name}", normal_style))
        elements.append(Spacer(1, 24))
        
        elements.append(Paragraph("AI Business Advisory Summary", heading_style))
        adv = request.advisory_data
        elements.append(Paragraph(f"<b>Market Reach:</b> {adv.market_reach}", normal_style))
        elements.append(Paragraph(f"<b>Pricing Strategy:</b> {adv.pricing_strategy}", normal_style))
        elements.append(Paragraph(f"<b>Competitor Analysis:</b> {adv.competitor_analysis}", normal_style))
        elements.append(Spacer(1, 12))
        
        elements.append(Paragraph("Financial Schedule", heading_style))
        fin = request.finance_data
        fin_summary = [
            ["Project Cost", f"INR {fin.project_cost}"],
            ["Loan Amount", f"INR {fin.loan_amount}"],
            ["EMI", f"INR {fin.emi}"],
            ["Tenure (Months)", f"{fin.tenure_months}"],
            ["Moratorium (Months)", f"{fin.moratorium_months}"]
        ]
        t_fin = Table(fin_summary, colWidths=[200, 200])
        t_fin.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        elements.append(t_fin)
        elements.append(Spacer(1, 24))
        
        elements.append(Paragraph("Recommended Scheme", heading_style))
        sch = request.scheme_data.recommended_scheme
        elements.append(Paragraph(f"<b>Scheme Name:</b> {sch.name}", normal_style))
        elements.append(Paragraph(f"<b>Type:</b> {sch.type}", normal_style))
        elements.append(Paragraph(f"<b>Max Loan Amount:</b> INR {sch.max_loan_amount}", normal_style))
        elements.append(Paragraph(f"<b>Description:</b> {sch.description}", normal_style))
        
        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        return pdf_bytes
