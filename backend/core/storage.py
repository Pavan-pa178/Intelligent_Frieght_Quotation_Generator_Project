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
