import re
import random
from datetime import datetime, timezone
from .regulations_data import REGULATION_DOCUMENTS, HS_CODE_REGISTRY

# In-memory storage for Customs compliance cases & audit logs
COMPLIANCE_CASES_DB = {}
CUSTOMS_AUDIT_LOGS = []

def run_customs_validation(shipment_data):
    """
    Executes hybrid RAG retrieval against regulation corpus + HS code validation.
    """
    origin = shipment_data.get("origin_country") or shipment_data.get("origin", "IN")
    dest = shipment_data.get("dest_country") or shipment_data.get("destination", "SG")
    hs_code = str(shipment_data.get("hs_code") or "850440").strip()
    commodity = shipment_data.get("commodity") or shipment_data.get("cargo_type") or "Electrical Goods"
    incoterm = shipment_data.get("incoterm", "CIF").upper()
    shipment_id = shipment_data.get("shipment_id", f"SHP-{random.randint(1000, 9999)}")

    # 1. HS Code Reference Lookup
    hs_meta = HS_CODE_REGISTRY.get(hs_code) or {
        "description": f"Standard commercial cargo - {commodity}",
        "chapter": hs_code[:2] if len(hs_code) >= 2 else "85",
        "restricted": False,
        "prohibited": False,
        "default_risk": "LOW",
        "mandatory_docs": ["Commercial Invoice", "Packing List", "Bill of Lading / Air Waybill", "Certificate of Origin"]
    }

    # 2. Hybrid RAG Search across Regulation Documents
    retrieved_citations = []
    matched_requirements = []
    required_docs_set = set(hs_meta["mandatory_docs"])

    search_terms = [hs_code, commodity.lower(), hs_meta["chapter"], origin.lower(), dest.lower()]

    for doc in REGULATION_DOCUMENTS:
        for sec in doc["sections"]:
            sec_text = f"{doc['title']} {sec['title']} {sec['content']}".lower()
            score = 0
            for term in search_terms:
                if term and term in sec_text:
                    score += 1

            if score > 0 or doc["country"] in [dest, origin, "GLOBAL"]:
                retrieved_citations.append({
                    "regulation_id": doc["id"],
                    "document_title": doc["title"],
                    "section_title": sec["title"],
                    "citation": sec["citation"],
                    "authority": doc["authority"],
                    "content_excerpt": sec["content"],
                    "relevance_score": round(0.75 + min(0.24, score * 0.08), 2)
                })
                for d in sec["required_documents"]:
                    required_docs_set.add(d)

    # 3. Build Checklist with dynamic uploaded status
    checklist = []
    for i, doc_name in enumerate(sorted(required_docs_set)):
        is_basic = doc_name in ["Commercial Invoice", "Packing List", "Ocean Bill of Lading", "Bill of Lading / Air Waybill"]
        # Basic docs simulated as generated/uploaded, specialty certs require review
        uploaded = is_basic
        checklist.append({
            "id": f"CHK-{i+1}",
            "item_name": doc_name,
            "mandatory": True,
            "status": "VERIFIED" if uploaded else "PENDING_UPLOAD",
            "document_uploaded": uploaded,
            "evidence_citation": retrieved_citations[0]["citation"] if retrieved_citations else "Customs General Order",
            "notes": "Verified by Document Parser" if uploaded else "Mandatory upload required before customs filing."
        })

    # 4. Readiness & Compliance Status Calculation
    uploaded_count = sum(1 for c in checklist if c["document_uploaded"])
    total_count = max(1, len(checklist))
    readiness_score = round((uploaded_count / total_count) * 100)

    if hs_meta["prohibited"]:
        compliance_status = "REJECTED"
        risk_level = "CRITICAL"
        requires_officer = True
        summary = "Shipment contains prohibited cargo under national security / international embargo lists. Quote issuance blocked."
    elif hs_meta["restricted"] or readiness_score < 70:
        compliance_status = "OFFICER_REVIEW_REQUIRED"
        risk_level = "HIGH"
        requires_officer = True
        summary = "Specialized permits or hazardous goods declarations require human Customs Officer review."
    elif readiness_score < 100:
        compliance_status = "NEEDS_DOCUMENTS"
        risk_level = "MEDIUM"
        requires_officer = True
        summary = "Standard customs clearance path. 1 or more supplementary compliance certificates pending upload."
    else:
        compliance_status = "APPROVED"
        risk_level = "LOW"
        requires_officer = False
        summary = "Full regulatory document set verified. Automated customs pre-clearance granted."

    now_iso = datetime.now(timezone.utc).isoformat()
    check_id = f"CUST-CHK-{random.randint(10000, 99999)}"

    case_record = {
        "check_id": check_id,
        "shipment_id": shipment_id,
        "origin_country": origin,
        "dest_country": dest,
        "hs_code": hs_code,
        "commodity": commodity,
        "incoterm": incoterm,
        "readiness_score": readiness_score,
        "risk_level": risk_level,
        "compliance_status": compliance_status,
        "requires_officer_review": requires_officer,
        "summary": summary,
        "checklist": checklist,
        "citations": retrieved_citations[:4],
        "created_at": now_iso,
        "reviewed_by": None,
        "reviewed_at": None,
        "officer_decision": "PENDING" if requires_officer else "AUTO_APPROVED",
        "officer_comments": ""
    }

    COMPLIANCE_CASES_DB[check_id] = case_record
    return case_record

def sign_off_compliance_case(check_id, decision, officer_name="Customs Officer", comments=""):
    """
    Records human Customs Officer decision: APPROVE, REQUEST_DOCUMENTS, REJECT.
    """
    case = COMPLIANCE_CASES_DB.get(check_id)
    if not case:
        case = {
            "check_id": check_id,
            "shipment_id": f"SHP-{random.randint(1000, 9999)}",
            "hs_code": "850440",
            "commodity": "Electrical Inverter Cargo",
            "checklist": []
        }
        COMPLIANCE_CASES_DB[check_id] = case

    now_iso = datetime.now(timezone.utc).isoformat()
    decision_upper = decision.upper()

    if decision_upper == "APPROVE":
        case["compliance_status"] = "APPROVED"
        case["officer_decision"] = "APPROVED"
        case["requires_officer_review"] = False
        quote_state = "READY_FOR_ISSUANCE"
    elif decision_upper == "REQUEST_DOCUMENTS":
        case["compliance_status"] = "NEEDS_DOCUMENTS"
        case["officer_decision"] = "HOLD"
        case["requires_officer_review"] = True
        quote_state = "HOLD"
    else:
        case["compliance_status"] = "REJECTED"
        case["officer_decision"] = "REJECTED"
        case["requires_officer_review"] = False
        quote_state = "BLOCKED"

    case["reviewed_by"] = officer_name
    case["reviewed_at"] = now_iso
    case["officer_comments"] = comments

    audit_entry = {
        "event_id": f"AUD-{random.randint(1000, 9999)}",
        "check_id": check_id,
        "actor": officer_name,
        "action": f"CUSTOMS_SIGN_OFF_{decision_upper}",
        "decision": decision_upper,
        "resulting_quote_state": quote_state,
        "comments": comments,
        "timestamp": now_iso
    }
    CUSTOMS_AUDIT_LOGS.append(audit_entry)

    return {
        "success": True,
        "check_id": check_id,
        "new_status": case["compliance_status"],
        "quote_state": quote_state,
        "case": case,
        "audit_entry": audit_entry
    }
