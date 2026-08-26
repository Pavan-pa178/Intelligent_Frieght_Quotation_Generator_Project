from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .rag_service import run_customs_validation, sign_off_compliance_case, COMPLIANCE_CASES_DB, CUSTOMS_AUDIT_LOGS
from .regulations_data import REGULATION_DOCUMENTS, HS_CODE_REGISTRY

class CustomsValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        res = run_customs_validation(data)
        return Response(res, status=status.HTTP_200_OK)

class CustomsSignOffView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, check_id=None):
        data = request.data
        c_id = check_id or data.get('check_id')
        decision = data.get('decision', 'APPROVE')
        officer = data.get('officer_name', 'Inspector Rajesh Kumar (Customs Compliance)')
        comments = data.get('comments', 'Verified submitted declaration & CE/DoC conformity certificates.')

        result = sign_off_compliance_case(c_id, decision, officer, comments)
        return Response(result, status=status.HTTP_200_OK)

class CustomsPendingReviewsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Return all cases or generate representative pending cases if empty
        if not COMPLIANCE_CASES_DB:
            run_customs_validation({"hs_code": "850440", "commodity": "Solar Inverters & Static Converters", "origin": "IN", "destination": "NL", "shipment_id": "SHP-7821"})
            run_customs_validation({"hs_code": "290511", "commodity": "Industrial Methanol", "origin": "IN", "destination": "SG", "shipment_id": "SHP-4190"})
            run_customs_validation({"hs_code": "847130", "commodity": "Enterprise Server Units", "origin": "IN", "destination": "AE", "shipment_id": "SHP-6302"})

        cases_list = list(COMPLIANCE_CASES_DB.values())
        return Response({
            "count": len(cases_list),
            "pending_count": sum(1 for c in cases_list if c.get("requires_officer_review")),
            "cases": cases_list,
            "audit_logs": CUSTOMS_AUDIT_LOGS
        })

class RegulationSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        query = (request.data.get('query') or '').lower()
        results = []
        for doc in REGULATION_DOCUMENTS:
            for sec in doc['sections']:
                if not query or query in doc['title'].lower() or query in sec['title'].lower() or query in sec['content'].lower():
                    results.append({
                        "doc_id": doc["id"],
                        "title": doc["title"],
                        "country": doc["country"],
                        "authority": doc["authority"],
                        "section_title": sec["title"],
                        "citation": sec["citation"],
                        "content": sec["content"],
                        "required_docs": sec["required_documents"]
                    })
        return Response({"query": query, "count": len(results), "results": results})
