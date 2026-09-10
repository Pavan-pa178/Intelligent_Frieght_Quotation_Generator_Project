import os
import json
import threading
import logging
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'data'
DATA_DIR.mkdir(parents=True, exist_ok=True)

QUOTES_FILE = DATA_DIR / 'quotes.json'
SHIPMENTS_FILE = DATA_DIR / 'shipments.json'
COMPANIES_FILE = DATA_DIR / 'companies.json'

_lock = threading.Lock()

def _read_json_file(file_path):
    if not file_path.exists():
        return []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception as e:
        logger.warning(f"Error reading {file_path}: {e}")
        return []

def _write_json_file(file_path, data):
    try:
        temp_path = file_path.with_suffix('.tmp')
        with open(temp_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        temp_path.replace(file_path)
    except Exception as e:
        logger.error(f"Error writing {file_path}: {e}")

# ─── QUOTES STORAGE ──────────────────────────────────────────────────────────

def load_quotes():
    with _lock:
        return _read_json_file(QUOTES_FILE)

def get_quote_by_id(qid):
    if not qid:
        return None
    qid_upper = str(qid).strip().upper()
    with _lock:
        quotes = _read_json_file(QUOTES_FILE)
        for q in quotes:
            if str(q.get('id', '')).strip().upper() == qid_upper:
                return dict(q)
    return None

def save_quote(quote_payload):
    if not quote_payload or not isinstance(quote_payload, dict):
        return None
    qid = str(quote_payload.get('id', '')).strip().upper()
    if not qid:
        return None

    with _lock:
        quotes = _read_json_file(QUOTES_FILE)
        idx = next((i for i, q in enumerate(quotes) if str(q.get('id', '')).strip().upper() == qid), None)
        if idx is not None:
            quotes[idx] = {**quotes[idx], **quote_payload}
            saved = quotes[idx]
        else:
            quotes.insert(0, quote_payload)
            saved = quote_payload
        _write_json_file(QUOTES_FILE, quotes)
        return dict(saved)

def update_quote_fields(qid, update_fields):
    if not qid or not update_fields:
        return None
    qid_upper = str(qid).strip().upper()
    with _lock:
        quotes = _read_json_file(QUOTES_FILE)
        idx = next((i for i, q in enumerate(quotes) if str(q.get('id', '')).strip().upper() == qid_upper), None)
        if idx is not None:
            curr = dict(quotes[idx])
            for k, v in update_fields.items():
                if '.' in k:
                    parts = k.split('.')
                    target = curr
                    for p in parts[:-1]:
                        if p not in target or not isinstance(target[p], dict):
                            target[p] = {}
                        target = target[p]
                    target[parts[-1]] = v
                else:
                    curr[k] = v
            quotes[idx] = curr
            _write_json_file(QUOTES_FILE, quotes)
            return curr
        else:
            new_q = {'id': qid, **update_fields}
            quotes.insert(0, new_q)
            _write_json_file(QUOTES_FILE, quotes)
            return new_q

def delete_quote_by_id(qid):
    if not qid:
        return False
    qid_upper = str(qid).strip().upper()
    with _lock:
        quotes = _read_json_file(QUOTES_FILE)
        new_quotes = [q for q in quotes if str(q.get('id', '')).strip().upper() != qid_upper]
        deleted = len(new_quotes) < len(quotes)
        if deleted:
            _write_json_file(QUOTES_FILE, new_quotes)
        return deleted

def clear_all_quotes():
    with _lock:
        _write_json_file(QUOTES_FILE, [])
        return True

# ─── SHIPMENTS STORAGE ────────────────────────────────────────────────────────

def load_shipments():
    with _lock:
        return _read_json_file(SHIPMENTS_FILE)

def get_shipment_by_id_or_tn(identifier):
    if not identifier:
        return None
    ident = str(identifier).strip().upper()
    with _lock:
        shipments = _read_json_file(SHIPMENTS_FILE)
        for s in shipments:
            if (
                str(s.get('shipment_id', '')).strip().upper() == ident or
                str(s.get('id', '')).strip().upper() == ident or
                str(s.get('tn', '')).strip().upper() == ident or
                str(s.get('quote_id', '')).strip().upper() == ident or
                str(s.get('quoteId', '')).strip().upper() == ident
            ):
                return dict(s)
    return None

def save_shipment(shipment_payload):
    if not shipment_payload or not isinstance(shipment_payload, dict):
        return None
    sid = str(shipment_payload.get('shipment_id') or shipment_payload.get('id') or shipment_payload.get('tn') or '').strip().upper()
    if not sid:
        return None

    with _lock:
        shipments = _read_json_file(SHIPMENTS_FILE)
        idx = next((
            i for i, s in enumerate(shipments)
            if (
                str(s.get('shipment_id', '')).strip().upper() == sid or
                str(s.get('id', '')).strip().upper() == sid or
                str(s.get('tn', '')).strip().upper() == sid or
                (s.get('quote_id') and str(s.get('quote_id', '')).strip().upper() == sid)
            )
        ), None)
        if idx is not None:
            shipments[idx] = {**shipments[idx], **shipment_payload}
            saved = shipments[idx]
        else:
            shipments.insert(0, shipment_payload)
            saved = shipment_payload
        _write_json_file(SHIPMENTS_FILE, shipments)
        return dict(saved)

def update_shipments_by_quote_id(qid, update_fields):
    if not qid:
        return 0
    qid_upper = str(qid).strip().upper()
    with _lock:
        shipments = _read_json_file(SHIPMENTS_FILE)
        matched_count = 0
        for i, s in enumerate(shipments):
            if (
                str(s.get('quote_id', '')).strip().upper() == qid_upper or
                str(s.get('quoteId', '')).strip().upper() == qid_upper or
                str(s.get('id', '')).strip().upper() == qid_upper or
                str(s.get('shipment_id', '')).strip().upper() == qid_upper
            ):
                shipments[i] = {**s, **update_fields}
                matched_count += 1
        if matched_count > 0:
            _write_json_file(SHIPMENTS_FILE, shipments)
        return matched_count


# ─── COMPANIES & AGENTS STORAGE ──────────────────────────────────────────────

DEFAULT_COMPANIES = [
    {
        "company_id": "COMP-CMA-01",
        "name": "CMA CGM",
        "carrier_key": "CMA CGM",
        "modes": ["Ocean FCL", "Ocean LCL", "Ground FTL"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Tier 1 Strategic Ocean Carrier",
        "sla_hours": "2h Fast-Track Review",
        "manager_email": "manager.cma@portline.in",
        "logo_color": "#E11D48",
        "agents": [
            {
                "agent_id": "AGT-CMA-01",
                "name": "Deepa Nair",
                "email": "agent.cmacgm@portline.in",
                "role": "agent",
                "phone": "+91 98201 10021",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-MSC-02",
        "name": "MSC (Mediterranean Shipping Co)",
        "carrier_key": "MSC",
        "modes": ["Ocean FCL", "Ocean LCL"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Global Alliance Direct Contract",
        "sla_hours": "2h Guaranteed SLA",
        "manager_email": "manager.msc@portline.in",
        "logo_color": "#D97706",
        "agents": [
            {
                "agent_id": "AGT-MSC-01",
                "name": "Vikram Singh",
                "email": "agent.msc@portline.in",
                "role": "agent",
                "phone": "+91 98202 10022",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-MSK-03",
        "name": "Maersk Line",
        "carrier_key": "Maersk",
        "modes": ["Ocean FCL", "Ocean LCL", "Rail Intermodal"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Premier Partner EDI Verified",
        "sla_hours": "1.5h Priority Review",
        "manager_email": "manager.maersk@portline.in",
        "logo_color": "#0284C7",
        "agents": [
            {
                "agent_id": "AGT-MSK-01",
                "name": "Kiran Reddy",
                "email": "agent.maersk@portline.in",
                "role": "agent",
                "phone": "+91 98203 10023",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-EVG-04",
        "name": "Evergreen Marine",
        "carrier_key": "Evergreen",
        "modes": ["Ocean FCL"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Ocean Alliance Verified Partner",
        "sla_hours": "2h Guaranteed SLA",
        "manager_email": "manager.evergreen@portline.in",
        "logo_color": "#059669",
        "agents": [
            {
                "agent_id": "AGT-EVG-01",
                "name": "Amrita Pillai",
                "email": "agent.evergreen@portline.in",
                "role": "agent",
                "phone": "+91 98204 10024",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-HLG-05",
        "name": "Hapag-Lloyd",
        "carrier_key": "Hapag-Lloyd",
        "modes": ["Ocean FCL", "Ocean LCL"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "THE Alliance Verified Contract",
        "sla_hours": "2h Standard SLA",
        "manager_email": "manager.hapag@portline.in",
        "logo_color": "#EA580C",
        "agents": [
            {
                "agent_id": "AGT-HLG-01",
                "name": "Sunil Verma",
                "email": "agent.hapag@portline.in",
                "role": "agent",
                "phone": "+91 98205 10025",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-COS-06",
        "name": "COSCO Shipping Lines",
        "carrier_key": "COSCO",
        "modes": ["Ocean FCL"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Ocean Alliance Direct Contract",
        "sla_hours": "2h Guaranteed SLA",
        "manager_email": "manager.cosco@portline.in",
        "logo_color": "#2563EB",
        "agents": [
            {
                "agent_id": "AGT-COS-01",
                "name": "Ravi Shankar",
                "email": "agent.cosco@portline.in",
                "role": "agent",
                "phone": "+91 98206 10026",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-ONE-07",
        "name": "Ocean Network Express (ONE)",
        "carrier_key": "ONE",
        "modes": ["Ocean FCL"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "THE Alliance Verified Partner",
        "sla_hours": "2h Standard SLA",
        "manager_email": "manager.one@portline.in",
        "logo_color": "#DB2777",
        "agents": [
            {
                "agent_id": "AGT-ONE-01",
                "name": "Pooja Menon",
                "email": "agent.one@portline.in",
                "role": "agent",
                "phone": "+91 98207 10027",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-AIR-08",
        "name": "Air Cargo Express",
        "carrier_key": "Air",
        "modes": ["Air Priority", "Air Pharma/Cold Chain", "Air Freight"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "IATA Direct Carrier Integration",
        "sla_hours": "1h Priority SLA",
        "manager_email": "manager.air@portline.in",
        "logo_color": "#7C3AED",
        "agents": [
            {
                "agent_id": "AGT-AIR-01",
                "name": "Meera Iyer",
                "email": "agent.air@portline.in",
                "role": "agent",
                "phone": "+91 98208 10028",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-EXP-09",
        "name": "Express Courier & Parcel",
        "carrier_key": "Express",
        "modes": ["Express Courier", "Air Charter"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Express Integrator Direct Contract",
        "sla_hours": "30m Rapid SLA",
        "manager_email": "manager.express@portline.in",
        "logo_color": "#D97706",
        "agents": [
            {
                "agent_id": "AGT-EXP-01",
                "name": "Nitesh Dubey",
                "email": "agent.express@portline.in",
                "role": "agent",
                "phone": "+91 98209 10029",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-GEN-10",
        "name": "PORTLINE General Carrier Network",
        "carrier_key": "General",
        "modes": ["Multimodal Unified"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Master Brokerage Operations Hub",
        "sla_hours": "2h SLA",
        "manager_email": "manager@portline.in",
        "logo_color": "#0A2540",
        "agents": [
            {
                "agent_id": "AGT-GEN-01",
                "name": "Arjun Agent",
                "email": "agent@portline.in",
                "role": "agent",
                "phone": "+91 98210 10030",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    }
]

def load_companies():
    with _lock:
        items = _read_json_file(COMPANIES_FILE)
        if not items:
            _write_json_file(COMPANIES_FILE, DEFAULT_COMPANIES)
            return list(DEFAULT_COMPANIES)
        return items

def get_company_by_id(cid):
    if not cid:
        return None
    cid_upper = str(cid).strip().upper()
    with _lock:
        companies = _read_json_file(COMPANIES_FILE) or DEFAULT_COMPANIES
        for c in companies:
            if (
                str(c.get('company_id', '')).strip().upper() == cid_upper or
                str(c.get('id', '')).strip().upper() == cid_upper or
                str(c.get('carrier_key', '')).strip().upper() == cid_upper or
                str(c.get('name', '')).strip().upper() == cid_upper
            ):
                return dict(c)
    return None

def save_company(company_payload):
    if not company_payload or not isinstance(company_payload, dict):
        return None
    cid = str(company_payload.get('company_id') or company_payload.get('id') or '').strip().upper()
    if not cid:
        cid = f"COMP-{str(company_payload.get('carrier_key') or company_payload.get('name', 'GEN')).replace(' ', '').upper()[:4]}-01"
        company_payload['company_id'] = cid

    with _lock:
        companies = _read_json_file(COMPANIES_FILE)
        if not companies:
            companies = list(DEFAULT_COMPANIES)
        idx = next((i for i, c in enumerate(companies) if str(c.get('company_id', '')).strip().upper() == cid), None)
        if idx is not None:
            companies[idx] = {**companies[idx], **company_payload}
            saved = companies[idx]
        else:
            companies.append(company_payload)
            saved = company_payload
        _write_json_file(COMPANIES_FILE, companies)
        return dict(saved)

def update_company(cid, update_fields):
    if not cid or not update_fields:
        return None
    cid_upper = str(cid).strip().upper()
    with _lock:
        companies = _read_json_file(COMPANIES_FILE)
        if not companies:
            companies = list(DEFAULT_COMPANIES)
        idx = next((i for i, c in enumerate(companies) if str(c.get('company_id', '')).strip().upper() == cid_upper or str(c.get('carrier_key', '')).strip().upper() == cid_upper), None)
        if idx is not None:
            companies[idx] = {**companies[idx], **update_fields}
            _write_json_file(COMPANIES_FILE, companies)
            return dict(companies[idx])
    return None

def add_agent_to_company(cid, agent_payload):
    if not cid or not agent_payload:
        return None
    cid_upper = str(cid).strip().upper()
    with _lock:
        companies = _read_json_file(COMPANIES_FILE)
        if not companies:
            companies = list(DEFAULT_COMPANIES)
        idx = next((i for i, c in enumerate(companies) if str(c.get('company_id', '')).strip().upper() == cid_upper or str(c.get('carrier_key', '')).strip().upper() == cid_upper), None)
        if idx is not None:
            c = companies[idx]
            agents = list(c.get('agents', []))
            email = agent_payload.get('email', '').strip().lower()
            existing_idx = next((i for i, a in enumerate(agents) if a.get('email', '').strip().lower() == email), None)
            if existing_idx is not None:
                agents[existing_idx] = {**agents[existing_idx], **agent_payload}
            else:
                agent_id = f"AGT-{cid_upper[:4]}-{len(agents)+1:02d}"
                agents.append({'agent_id': agent_id, **agent_payload})
            companies[idx]['agents'] = agents
            _write_json_file(COMPANIES_FILE, companies)
            return dict(companies[idx])
    return None

def remove_agent_from_company(cid, agent_email):
    if not cid or not agent_email:
        return False
    cid_upper = str(cid).strip().upper()
    email_lower = str(agent_email).strip().lower()
    with _lock:
        companies = _read_json_file(COMPANIES_FILE)
        if not companies:
            companies = list(DEFAULT_COMPANIES)
        idx = next((i for i, c in enumerate(companies) if str(c.get('company_id', '')).strip().upper() == cid_upper or str(c.get('carrier_key', '')).strip().upper() == cid_upper), None)
        if idx is not None:
            agents = [a for a in companies[idx].get('agents', []) if a.get('email', '').strip().lower() != email_lower]
            companies[idx]['agents'] = agents
            _write_json_file(COMPANIES_FILE, companies)
            return True
    return False
