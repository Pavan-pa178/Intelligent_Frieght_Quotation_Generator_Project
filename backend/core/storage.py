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
    # ─── OCEAN FREIGHT CARRIERS ───
    {
        "company_id": "COMP-CMA-01",
        "name": "CMA CGM",
        "carrier_key": "CMA CGM",
        "service_category": "OCEAN",
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
        "service_category": "OCEAN",
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
        "service_category": "OCEAN",
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
        "service_category": "OCEAN",
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
        "service_category": "OCEAN",
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
        "service_category": "OCEAN",
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
        "service_category": "OCEAN",
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

    # ─── AIR FREIGHT & EXPRESS AIR CARRIERS ───
    {
        "company_id": "COMP-AIR-08",
        "name": "Air India Cargo",
        "carrier_key": "Air India Cargo",
        "service_category": "AIR",
        "modes": ["Air Priority", "Air Pharma/Cold Chain", "Air Freight"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "National Flag Carrier Air Priority",
        "sla_hours": "45m Express Air SLA",
        "manager_email": "manager.airindia@portline.in",
        "logo_color": "#7F1D1D",
        "agents": [
            {
                "agent_id": "AGT-AIR-01",
                "name": "Pooja Verma",
                "email": "agent.airindia@portline.in",
                "role": "agent",
                "phone": "+91 98208 10028",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-EK-09",
        "name": "Emirates SkyCargo",
        "carrier_key": "Emirates SkyCargo",
        "service_category": "AIR",
        "modes": ["Air Freight", "Express Air", "Air Priority"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Global Air Cargo Strategic SLA",
        "sla_hours": "30m Urgent Air SLA",
        "manager_email": "manager.emirates@portline.in",
        "logo_color": "#C2410C",
        "agents": [
            {
                "agent_id": "AGT-EK-01",
                "name": "Farhan Khan",
                "email": "agent.emirates@portline.in",
                "role": "agent",
                "phone": "+91 98209 10031",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-DTD-10",
        "name": "DTDC Express",
        "carrier_key": "DTDC Express",
        "service_category": "AIR",
        "modes": ["Express Courier", "Air Priority", "Express Air"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Express Courier Platinum Partner",
        "sla_hours": "30m Rapid SLA",
        "manager_email": "manager.dtdc@portline.in",
        "logo_color": "#D97706",
        "agents": [
            {
                "agent_id": "AGT-DTD-01",
                "name": "Rakesh Sharma",
                "email": "agent.dtdc@portline.in",
                "role": "agent",
                "phone": "+91 98210 10032",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-DEL-11",
        "name": "Delta Cargo Movers",
        "carrier_key": "Delta Cargo Movers",
        "service_category": "AIR",
        "modes": ["Air Freight", "Air Charter", "Express Air"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Commercial Freight Forwarder Direct",
        "sla_hours": "1h Priority SLA",
        "manager_email": "manager.deltacargo@portline.in",
        "logo_color": "#2563EB",
        "agents": [
            {
                "agent_id": "AGT-DEL-01",
                "name": "Suresh Babu",
                "email": "agent.deltacargo@portline.in",
                "role": "agent",
                "phone": "+91 98211 10033",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-COC-12",
        "name": "Cocanada Xpress",
        "carrier_key": "Cocanada Xpress",
        "service_category": "AIR",
        "modes": ["Express Air", "Air Priority", "Air Cargo"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Regional Fast-Track Air Provider",
        "sla_hours": "45m Regional SLA",
        "manager_email": "manager.cocanada@portline.in",
        "logo_color": "#0D9488",
        "agents": [
            {
                "agent_id": "AGT-COC-01",
                "name": "Venkat Rao",
                "email": "agent.cocanada@portline.in",
                "role": "agent",
                "phone": "+91 98212 10034",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-BLU-13",
        "name": "Blue Dart Aviation",
        "carrier_key": "Blue Dart Aviation",
        "service_category": "AIR",
        "modes": ["Express Air", "Air Priority", "Air Freight"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Scheduled Cargo Airline Tier 1",
        "sla_hours": "30m Rapid SLA",
        "manager_email": "manager.bluedart@portline.in",
        "logo_color": "#0284C7",
        "agents": [
            {
                "agent_id": "AGT-BLU-01",
                "name": "Anita Deshmukh",
                "email": "agent.bluedart@portline.in",
                "role": "agent",
                "phone": "+91 98213 10035",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-LH-14",
        "name": "Lufthansa Cargo",
        "carrier_key": "Lufthansa Cargo",
        "service_category": "AIR",
        "modes": ["Air Freight", "Air Pharma/Cold Chain"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Premium Express Air Carrier",
        "sla_hours": "45m Urgent Air SLA",
        "manager_email": "manager.lufthansa@portline.in",
        "logo_color": "#F59E0B",
        "agents": [
            {
                "agent_id": "AGT-LH-01",
                "name": "Marcus Weber",
                "email": "agent.lufthansa@portline.in",
                "role": "agent",
                "phone": "+91 98214 10036",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-VRLA-15",
        "name": "VRL Air Cargo",
        "carrier_key": "VRL Air Cargo",
        "service_category": "AIR",
        "modes": ["Air Freight", "Express Air"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Priority Cargo Charter Agreement",
        "sla_hours": "1h Standard SLA",
        "manager_email": "manager.vrlair@portline.in",
        "logo_color": "#16A34A",
        "agents": [
            {
                "agent_id": "AGT-VRLA-01",
                "name": "Vijay Sankeshwar",
                "email": "agent.vrl@portline.in",
                "role": "agent",
                "phone": "+91 98215 10037",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },

    # ─── GROUND & RAIL CARRIERS ───
    {
        "company_id": "COMP-CON-16",
        "name": "CONCOR (Container Corporation of India)",
        "carrier_key": "CONCOR",
        "service_category": "GROUND_RAIL",
        "modes": ["Rail Intermodal", "Rail Bulk"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "National Rail Logistics Authority",
        "sla_hours": "2h Guaranteed SLA",
        "manager_email": "manager.concor@portline.in",
        "logo_color": "#0369A1",
        "agents": [
            {
                "agent_id": "AGT-CON-01",
                "name": "Rajesh Kumar",
                "email": "agent.concor@portline.in",
                "role": "agent",
                "phone": "+91 98216 10038",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-VRL-17",
        "name": "VRL Logistics (Road & Rail)",
        "carrier_key": "VRL Logistics",
        "service_category": "GROUND_RAIL",
        "modes": ["Ground FTL", "Ground LTL"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Tier 1 National Highway Carrier",
        "sla_hours": "1.5h Road SLA",
        "manager_email": "manager.vrllogistics@portline.in",
        "logo_color": "#15803D",
        "agents": [
            {
                "agent_id": "AGT-VRL-01",
                "name": "Anand Sankeshwar",
                "email": "agent.vrllogistics@portline.in",
                "role": "agent",
                "phone": "+91 98217 10039",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-TCI-18",
        "name": "TCI Freight (Transport Corporation of India)",
        "carrier_key": "TCI Freight",
        "service_category": "GROUND_RAIL",
        "modes": ["Ground FTL", "Ground LTL", "Rail Intermodal"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Integrated Multimodal Leader",
        "sla_hours": "2h Standard SLA",
        "manager_email": "manager.tci@portline.in",
        "logo_color": "#B45309",
        "agents": [
            {
                "agent_id": "AGT-TCI-01",
                "name": "Ramesh Agarwal",
                "email": "agent.tci@portline.in",
                "role": "agent",
                "phone": "+91 98218 10040",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-GAT-19",
        "name": "GATI-KWE",
        "carrier_key": "GATI-KWE",
        "service_category": "GROUND_RAIL",
        "modes": ["Ground FTL", "Ground Express", "Rail Intermodal"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Express Surface Network Partner",
        "sla_hours": "2h SLA",
        "manager_email": "manager.gati@portline.in",
        "logo_color": "#7C3AED",
        "agents": [
            {
                "agent_id": "AGT-GAT-01",
                "name": "Manoj Joshi",
                "email": "agent.gati@portline.in",
                "role": "agent",
                "phone": "+91 98219 10041",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-ALL-20",
        "name": "Allcargo Logistics",
        "carrier_key": "Allcargo Logistics",
        "service_category": "GROUND_RAIL",
        "modes": ["Ground FTL", "Rail Intermodal"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Global CFS & Rail Railhead",
        "sla_hours": "2h Standard SLA",
        "manager_email": "manager.allcargo@portline.in",
        "logo_color": "#0F766E",
        "agents": [
            {
                "agent_id": "AGT-ALL-01",
                "name": "Shashi Kiran",
                "email": "agent.allcargo@portline.in",
                "role": "agent",
                "phone": "+91 98220 10042",
                "status": "ACTIVE",
                "created_at": "2026-01-15T09:00:00Z"
            }
        ]
    },
    {
        "company_id": "COMP-DLV-21",
        "name": "Delhivery Freight",
        "carrier_key": "Delhivery Freight",
        "service_category": "GROUND_RAIL",
        "modes": ["Ground FTL", "Ground LTL"],
        "status": "APPROVED",
        "is_eligible": True,
        "contract_tier": "Tech-Enabled Automated Surface Fleet",
        "sla_hours": "1.5h Priority SLA",
        "manager_email": "manager.delhivery@portline.in",
        "logo_color": "#DC2626",
        "agents": [
            {
                "agent_id": "AGT-DLV-01",
                "name": "Sahil Barua",
                "email": "agent.delhivery@portline.in",
                "role": "agent",
                "phone": "+91 98221 10043",
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

        # Merge any missing default companies so all categories and new carriers are automatically available
        existing_keys = {str(c.get('carrier_key', '')).strip().upper() for c in items}
        existing_ids = {str(c.get('company_id', '')).strip().upper() for c in items}
        changed = False

        for dc in DEFAULT_COMPANIES:
            k = str(dc.get('carrier_key', '')).strip().upper()
            cid = str(dc.get('company_id', '')).strip().upper()
            if k not in existing_keys and cid not in existing_ids:
                items.append(dc)
                existing_keys.add(k)
                existing_ids.add(cid)
                changed = True
        # Ensure all items have a valid service_category and logo_color
        for it in items:
            if not it.get('service_category'):
                modes_str = ' '.join(it.get('modes', [])) if isinstance(it.get('modes'), list) else str(it.get('modes', ''))
                all_text = (modes_str + ' ' + str(it.get('name', ''))).lower()
                if 'air' in all_text or 'express' in all_text or 'parcel' in all_text:
                    it['service_category'] = 'AIR'
                elif 'rail' in all_text or 'ground' in all_text or 'truck' in all_text or 'road' in all_text:
                    it['service_category'] = 'GROUND_RAIL'
                else:
                    it['service_category'] = 'OCEAN'
                changed = True
            if not it.get('logo_color'):
                it['logo_color'] = '#0A2540'
                changed = True

        if changed:
            _write_json_file(COMPANIES_FILE, items)
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
