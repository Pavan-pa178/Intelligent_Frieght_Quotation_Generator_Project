from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

SEED_QUOTES = [
  {
    'id': 'QT-2026-00934',
    'customer': 'Sharma Textiles',
    'city': 'Mumbai',
    'laneCode': 'INNSA → AEJEA',
    'laneName': 'Mumbai → Dubai',
    'region': 'Middle East',
    'mode': 'Ocean FCL',
    'modeKey': 'ocean',
    'basis': '2 × 40HC',
    'transit': '6–10 d',
    'indicativeTotal': 384500,
    'status': 'Draft',
    'created': '2 min ago',
    'details': {
      'originGw': { 'code': 'INNSA', 'name': 'Nhava Sheva, Mumbai', 'city': 'Mumbai', 'country': 'India' },
      'destGw': { 'code': 'AEJEA', 'name': 'Jebel Ali, Dubai', 'city': 'Dubai', 'country': 'UAE' },
      'commodity': 'Cotton textile rolls, unbleached',
      'hsCode': '5208.11',
      'grossWeightKg': 18400,
      'routes': [
        {
          'id': 'r1',
          'carrier': 'Maersk',
          'serviceName': 'MECL Direct Express',
          'type': 'Direct',
          'sailingFrequency': 'Weekly sailing (Mon)',
          'reliabilityPct': 94,
          'recommended': True,
          'cost': 384500,
          'indicative': True,
          'scores': { 'transit': 0.92, 'cost': 0.78, 'reliability': 0.94, 'congestion': 0.71, 'composite': 0.86 }
        },
        {
          'id': 'r2',
          'carrier': 'CMA CGM',
          'serviceName': 'EPIC 1 Transhipment',
          'type': '1 Transhipment (Salalah)',
          'sailingFrequency': 'Twice weekly (Wed/Sat)',
          'reliabilityPct': 89,
          'recommended': False,
          'cost': 341200,
          'indicative': True,
          'scores': { 'transit': 0.64, 'cost': 0.95, 'reliability': 0.89, 'congestion': 0.82, 'composite': 0.80 }
        },
        {
          'id': 'r3',
          'carrier': 'Hapag-Lloyd',
          'serviceName': 'AGX Direct Service',
          'type': 'Direct',
          'sailingFrequency': 'Weekly sailing (Fri)',
          'reliabilityPct': 92,
          'recommended': False,
          'cost': 402900,
          'indicative': True,
          'scores': { 'transit': 0.88, 'cost': 0.70, 'reliability': 0.92, 'congestion': 0.65, 'composite': 0.79 }
        }
      ],
      'transitBreakdown': [
        { 'label': 'Pickup leg (34 km road)', 'val': '1.0 d' },
        { 'label': 'Origin dwell — FCL', 'val': '3.0 d' },
        { 'label': 'Sea leg — 1,205 nm ÷ 400', 'val': '3.0 d' },
        { 'label': 'Schedule wait (weekly ÷ 2)', 'val': '3.5 d' },
        { 'label': 'Destination dwell', 'val': '3.0 d' },
        { 'label': 'Delivery leg', 'val': '0.0 d' }
      ]
    }
  },
  {
    'id': 'QT-2026-00933',
    'customer': 'Nordic Imports AB',
    'city': 'Gothenburg',
    'laneCode': 'INNSA → NLRTM',
    'laneName': 'Mumbai → Rotterdam',
    'region': 'Asia–Europe',
    'mode': 'Ocean FCL',
    'modeKey': 'ocean',
    'basis': '1 × 20GP',
    'transit': '24–28 d',
    'indicativeTotal': 215800,
    'status': 'Issued',
    'created': '1 hour ago',
    'details': {
      'originGw': { 'code': 'INNSA', 'name': 'Nhava Sheva, Mumbai', 'city': 'Mumbai', 'country': 'India' },
      'destGw': { 'code': 'NLRTM', 'name': 'Port of Rotterdam', 'city': 'Rotterdam', 'country': 'Netherlands' },
      'commodity': 'Precision engineering components',
      'hsCode': '8483.40',
      'grossWeightKg': 14200,
      'routes': [
        {
          'id': 'r1',
          'carrier': 'MSC Mediterranean Shipping',
          'serviceName': 'IPAK Europe Direct Corridor',
          'type': 'Direct',
          'sailingFrequency': 'Weekly sailing (Thu)',
          'reliabilityPct': 91,
          'recommended': True,
          'cost': 215800,
          'indicative': True,
          'scores': { 'transit': 0.89, 'cost': 0.85, 'reliability': 0.91, 'congestion': 0.75, 'composite': 0.85 }
        },
        {
          'id': 'r2',
          'carrier': 'Hapag-Lloyd',
          'serviceName': 'IOS Express Express',
          'type': 'Direct Express',
          'sailingFrequency': 'Weekly sailing (Tue)',
          'reliabilityPct': 95,
          'recommended': False,
          'cost': 238000,
          'indicative': True,
          'scores': { 'transit': 0.94, 'cost': 0.72, 'reliability': 0.95, 'congestion': 0.80, 'composite': 0.85 }
        }
      ],
      'transitBreakdown': [
        { 'label': 'Pickup leg (45 km road)', 'val': '1.0 d' },
        { 'label': 'Origin dwell — FCL', 'val': '3.0 d' },
        { 'label': 'Sea leg — 6,400 nm ÷ 400', 'val': '16.0 d' },
        { 'label': 'Schedule wait', 'val': '3.5 d' },
        { 'label': 'Destination dwell (Rotterdam)', 'val': '3.0 d' }
      ]
    }
  },
  {
    'id': 'QT-2026-00932',
    'customer': 'Gulf Machinery LLC',
    'city': 'Dubai',
    'laneCode': 'BOM → DXB',
    'laneName': 'Mumbai → Dubai',
    'region': 'Middle East',
    'mode': 'Air Freight',
    'modeKey': 'air',
    'basis': '250 kg ch.',
    'transit': '5–7 d',
    'indicativeTotal': 64300,
    'status': 'Issued',
    'created': '3 hours ago',
    'details': {
      'originGw': { 'code': 'BOM', 'name': 'Mumbai Airport (BOM)', 'city': 'Mumbai', 'country': 'India' },
      'destGw': { 'code': 'DXB', 'name': 'Dubai Intl Airport (DXB)', 'city': 'Dubai', 'country': 'UAE' },
      'commodity': 'High-precision hydraulic pump valves',
      'hsCode': '8413.70',
      'grossWeightKg': 250,
      'routes': [
        {
          'id': 'r1',
          'carrier': 'Emirates SkyCargo',
          'serviceName': 'EK Priority Air Freighter',
          'type': 'Direct Flight',
          'sailingFrequency': 'Daily flights',
          'reliabilityPct': 97,
          'recommended': True,
          'cost': 64300,
          'indicative': True,
          'scores': { 'transit': 0.98, 'cost': 0.80, 'reliability': 0.97, 'congestion': 0.88, 'composite': 0.91 }
        }
      ],
      'transitBreakdown': [
        { 'label': 'Airport handling origin (BOM)', 'val': '1.0 d' },
        { 'label': 'Flight linehaul (1,920 km)', 'val': '0.5 d' },
        { 'label': 'Customs & import handling (DXB)', 'val': '1.5 d' }
      ]
    }
  },
  {
    'id': 'QT-2026-00931',
    'customer': 'Silk Road Traders Ltd',
    'city': 'Singapore',
    'laneCode': 'INNSA → SGSIN',
    'laneName': 'Mumbai → Singapore',
    'region': 'Intra-Asia',
    'mode': 'Ocean LCL',
    'modeKey': 'ocean',
    'basis': '4.2 R/T',
    'transit': '11–16 d',
    'indicativeTotal': 88400,
    'status': 'Draft',
    'created': 'Yesterday',
    'details': {
      'originGw': { 'code': 'INNSA', 'name': 'Nhava Sheva, Mumbai', 'city': 'Mumbai', 'country': 'India' },
      'destGw': { 'code': 'SGSIN', 'name': 'Port of Singapore', 'city': 'Singapore', 'country': 'Singapore' },
      'commodity': 'Organic essential oils & botanical extracts',
      'hsCode': '3301.29',
      'grossWeightKg': 2100,
      'routes': [
        {
          'id': 'r1',
          'carrier': 'ONE Ocean Network Express',
          'serviceName': 'Intra-Asia Loop 2',
          'type': 'Direct',
          'sailingFrequency': 'Twice weekly',
          'reliabilityPct': 93,
          'recommended': True,
          'cost': 88400,
          'indicative': True,
          'scores': { 'transit': 0.91, 'cost': 0.88, 'reliability': 0.93, 'congestion': 0.80, 'composite': 0.88 }
        }
      ],
      'transitBreakdown': [
        { 'label': 'Origin LCL consolidation dwell', 'val': '5.0 d' },
        { 'label': 'Sea leg — 2,450 nm ÷ 400', 'val': '6.1 d' },
        { 'label': 'Destination LCL deconsolidation', 'val': '4.0 d' }
      ]
    }
  },
  {
    'id': 'QT-2026-00930',
    'customer': 'Andes Trading SAC',
    'city': 'Callao',
    'laneCode': 'INNSA → PECLL',
    'laneName': 'Mumbai → Callao',
    'region': 'South America',
    'mode': 'Ocean FCL',
    'modeKey': 'ocean',
    'basis': '—',
    'transit': '—',
    'indicativeTotal': None,
    'status': 'No routing',
    'created': 'Yesterday',
    'details': {
      'originGw': { 'code': 'INNSA', 'name': 'Nhava Sheva, Mumbai', 'city': 'Mumbai', 'country': 'India' },
      'destGw': { 'code': 'PECLL', 'name': 'Port of Callao', 'city': 'Callao', 'country': 'Peru' },
      'commodity': 'Industrial agricultural tools',
      'hsCode': '8201.30',
      'grossWeightKg': 16500,
      'routes': [],
      'transitBreakdown': []
    }
  }
]

from core.mongodb import get_collection

class QuoteListCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user_email = request.query_params.get('email', '').strip().lower()
        try:
            col = get_collection('quotes')
            if col is not None:
                query = {'user_email': user_email} if user_email else {}
                db_quotes = list(col.find(query, {'_id': 0}))
                if db_quotes:
                    return Response(db_quotes)
                elif user_email and user_email != 'demo@portline.in':
                    return Response([])
        except Exception:
            pass
        if user_email and user_email != 'demo@portline.in':
            return Response([])
        return Response(SEED_QUOTES)

    def post(self, request):
        payload = request.data
        if not payload:
            return Response({'detail': 'Payload empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_email = payload.get('user_email') or (request.user.email if request.user and request.user.is_authenticated else '')
        if user_email:
            payload['user_email'] = user_email.lower()

        try:
            col = get_collection('quotes')
            if col is not None:
                # Upsert by quote id
                qid = payload.get('id')
                if qid:
                    col.update_one({'id': qid}, {'$set': payload}, upsert=True)
                else:
                    col.insert_one(payload)
        except Exception as e:
            pass

        return Response(payload, status=status.HTTP_201_CREATED)

class QuoteDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, quote_id):
        qid = (quote_id or '').strip().upper()
        try:
            col = get_collection('quotes')
            if col is not None:
                found_db = col.find_one({'id': {'$regex': f'^{qid}$', '$options': 'i'}}, {'_id': 0})
                if found_db:
                    return Response(found_db)
        except Exception:
            pass

        found = next((q for q in SEED_QUOTES if q['id'].upper() == qid), SEED_QUOTES[0])
        return Response(found)


def _find_quote_anywhere(qid):
    col = get_collection('quotes')
    if col is not None:
        try:
            q = col.find_one({'id': {'$regex': f'^{qid}$', '$options': 'i'}}, {'_id': 0})
            if q:
                return q
        except Exception:
            pass
    for pool in (SEED_QUOTES,):
        found = next((m for m in pool if m.get('id', '').lower() == qid.lower()), None)
        if found:
            return found
    return None


def _update_quote_anywhere(qid, update_fields):
    updated = False
    col = get_collection('quotes')
    if col is not None:
        try:
            res = col.update_one({'id': {'$regex': f'^{qid}$', '$options': 'i'}}, {'$set': update_fields})
            if res.matched_count > 0:
                updated = True
        except Exception:
            pass

    for pool in (SEED_QUOTES,):
        mq = next((m for m in pool if m.get('id', '').lower() == qid.lower()), None)
        if mq:
            for k, v in update_fields.items():
                if '.' in k:
                    parts = k.split('.')
                    curr = mq
                    for p in parts[:-1]:
                        if p not in curr or not isinstance(curr[p], dict):
                            curr[p] = {}
                        curr = curr[p]
                    curr[parts[-1]] = v
                else:
                    mq[k] = v
            updated = True
    return updated



class QuoteAgentActionView(APIView):
    """Agent approve / reject a quote and store the decision."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, quote_id):
        from datetime import datetime, timezone
        qid = (quote_id or '').strip()
        action = request.data.get('action', '').strip()   # 'approved' | 'rejected'
        comment = request.data.get('comment', '').strip()
        agent_email = request.data.get('agent_email', '').strip()
        agent_name = request.data.get('agent_name', '').strip()

        if action not in ('approved', 'rejected'):
            return Response({'detail': 'action must be approved or rejected'}, status=status.HTTP_400_BAD_REQUEST)

        review = {
            'status': action,
            'comment': comment,
            'agent_email': agent_email,
            'agent_name': agent_name or 'Freight Agent',
            'reviewed_at': datetime.now(timezone.utc).isoformat(),
        }

        quote_status = 'Agent Approved' if action == 'approved' else 'Rejected by Agent'
        pipeline_status = 'AGENT_APPROVED' if action == 'approved' else 'AGENT_REJECTED'

        try:
            updated = _update_quote_anywhere(qid, {
                'agent_review': review,
                'status': quote_status,
                'pipeline_status': pipeline_status
            })
            if not updated:
                return Response({'detail': f'Quote {qid} not found'}, status=status.HTTP_404_NOT_FOUND)

            # Update shipment if linked
            q = _find_quote_anywhere(qid)
            shipments_col = get_collection('shipments')
            if shipments_col is not None and q and q.get('shipment_id'):
                shipments_col.update_one(
                    {'shipment_id': q.get('shipment_id')},
                    {'$set': {'pipeline_status': pipeline_status}}
                )
        except Exception as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'ok': True, 'quote_id': qid, 'review': review, 'status': quote_status})


class QuoteRouteSelectView(APIView):
    """Customer selects a recommended route option and submits it for approval."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, quote_id):
        from datetime import datetime, timezone
        qid = (quote_id or '').strip()
        route = request.data.get('route') or {}
        requested_by = request.data.get('requested_by') or (request.user.email if request.user and request.user.is_authenticated else 'Customer')

        if not route or not route.get('carrier'):
            return Response({'detail': 'Valid route payload required'}, status=status.HTTP_400_BAD_REQUEST)

        now_str = datetime.now(timezone.utc).isoformat()
        route_record = {
            **route,
            'requested_by': requested_by,
            'selected_at': now_str,
            'approval_status': 'PENDING_APPROVAL'
        }

        cost = route.get('cost')

        try:
            update_fields = {
                'selected_route': route_record,
                'route_approval_status': 'PENDING_APPROVAL',
                'route_requested_at': now_str
            }
            if cost:
                update_fields['indicativeTotal'] = cost

            _update_quote_anywhere(qid, update_fields)
        except Exception as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'ok': True,
            'quote_id': qid,
            'selected_route': route_record,
            'indicativeTotal': cost
        }, status=status.HTTP_200_OK)


class QuoteCustomsActionView(APIView):
    """Customs Officer approves documentation or requests specific required documents."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, quote_id):
        from datetime import datetime, timezone
        qid = (quote_id or '').strip()
        action = (request.data.get('action') or '').strip().lower() # 'approve' | 'request_documents' | 'reject'
        requested_docs = request.data.get('requested_docs') or []
        officer_notes = request.data.get('officer_notes') or request.data.get('comment') or ''
        officer_name = request.data.get('officer_name') or 'Customs Officer'
        officer_email = request.data.get('officer_email') or ''

        now_str = datetime.now(timezone.utc).isoformat()

        try:
            q = _find_quote_anywhere(qid)
            if not q:
                return Response({'detail': f'Quote {qid} not found'}, status=status.HTTP_404_NOT_FOUND)

            if action == 'approve':
                customs_review = {
                    'status': 'approved',
                    'officer_name': officer_name,
                    'officer_email': officer_email,
                    'reviewed_at': now_str,
                    'notes': officer_notes
                }
                # Both Agent and Customs approved -> Quote is ready for customer acceptance
                _update_quote_anywhere(qid, {
                    'customs_review': customs_review,
                    'status': 'Approved',
                    'pipeline_status': 'CUSTOMS_APPROVED',
                    'm3_customs.compliance_status': 'APPROVED',
                    'm3_customs.requires_officer_review': False
                })
                status_label = 'Approved'

            elif action == 'request_documents':
                doc_request = {
                    'requested_docs': requested_docs,
                    'officer_notes': officer_notes,
                    'requested_at': now_str,
                    'officer_name': officer_name,
                    'status': 'PENDING_CUSTOMER_UPLOAD'
                }
                _update_quote_anywhere(qid, {
                    'customs_document_request': doc_request,
                    'status': 'Documents Requested',
                    'pipeline_status': 'CUSTOMS_DOCS_REQUESTED'
                })
                status_label = 'Documents Requested'

            elif action == 'reject':
                customs_review = {
                    'status': 'rejected',
                    'officer_name': officer_name,
                    'officer_email': officer_email,
                    'reviewed_at': now_str,
                    'notes': officer_notes
                }
                _update_quote_anywhere(qid, {
                    'customs_review': customs_review,
                    'status': 'Rejected by Customs',
                    'pipeline_status': 'CUSTOMS_REJECTED'
                })
                status_label = 'Rejected by Customs'
            else:
                return Response({'detail': 'action must be approve, request_documents, or reject'}, status=status.HTTP_400_BAD_REQUEST)

            # Update shipment if linked
            shipments_col = get_collection('shipments')
            if shipments_col is not None and q.get('shipment_id'):
                shipments_col.update_one(
                    {'shipment_id': q.get('shipment_id')},
                    {'$set': {'customs_status': status_label}}
                )

            return Response({'ok': True, 'quote_id': qid, 'action': action, 'status': status_label})

        except Exception as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuoteDocumentUploadView(APIView):
    """Customer uploads required customs compliance documents."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, quote_id):
        from datetime import datetime, timezone
        qid = (quote_id or '').strip()
        uploaded_docs = request.data.get('uploaded_docs') or [] # list of { name, file_name, file_size, file_type }
        uploaded_by = request.data.get('uploaded_by') or 'Customer'
        now_str = datetime.now(timezone.utc).isoformat()

        if not uploaded_docs:
            return Response({'detail': 'No documents provided in upload'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            q = _find_quote_anywhere(qid)
            if not q:
                return Response({'detail': f'Quote {qid} not found'}, status=status.HTTP_404_NOT_FOUND)

            # Update checklist items in quote's m3_customs
            m3_c = q.get('m3_customs') or {}
            checklist = m3_c.get('checklist') or []
            uploaded_names = {d.get('name', '').strip().lower() for d in uploaded_docs}

            for item in checklist:
                item_name = (item.get('item_name') or item.get('name') or '').strip().lower()
                if item_name in uploaded_names:
                    item['document_uploaded'] = True
                    item['status'] = 'VERIFIED'
                    item['uploaded_at'] = now_str

            # Recalculate readiness
            tot = max(1, len(checklist))
            up_cnt = sum(1 for item in checklist if item.get('document_uploaded'))
            readiness = round((up_cnt / tot) * 100)
            m3_c['readiness_score'] = readiness
            m3_c['checklist'] = checklist

            # Append to uploaded documents history
            existing_uploads = q.get('customer_uploaded_documents') or []
            for ud in uploaded_docs:
                existing_uploads.append({
                    **ud,
                    'uploaded_by': uploaded_by,
                    'uploaded_at': now_str
                })

            _update_quote_anywhere(qid, {
                'm3_customs': m3_c,
                'customer_uploaded_documents': existing_uploads,
                'customs_document_request.status': 'DOCUMENTS_SUBMITTED',
                'status': 'Documents Submitted (Pending Customs Sign-off)',
                'pipeline_status': 'DOCS_SUBMITTED'
            })

            return Response({
                'ok': True,
                'quote_id': qid,
                'readiness_score': readiness,
                'status': 'Documents Submitted (Pending Customs Sign-off)',
                'uploaded_count': len(uploaded_docs)
            }, status=status.HTTP_200_OK)

        except Exception as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuoteCustomerDecisionView(APIView):
    """Customer accept / reject a quote and persist the decision."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, quote_id):
        from datetime import datetime, timezone
        qid = (quote_id or '').strip()
        decision = (request.data.get('decision') or request.data.get('action') or '').strip().lower() # 'accepted' | 'rejected'
        notes = request.data.get('notes', '').strip()
        customer_email = request.data.get('customer_email') or (request.user.email if request.user and request.user.is_authenticated else '')
        customer_name = request.data.get('customer_name') or 'Customer'

        if decision not in ('accepted', 'rejected'):
            return Response({'detail': 'decision must be accepted or rejected'}, status=status.HTTP_400_BAD_REQUEST)

        record = {
            'status': decision.upper(),
            'notes': notes,
            'customer_email': customer_email,
            'customer_name': customer_name,
            'decided_at': datetime.now(timezone.utc).isoformat(),
        }

        quote_status = 'Accepted' if decision == 'accepted' else 'Rejected'

        try:
            q = _find_quote_anywhere(qid)
            _update_quote_anywhere(qid, {
                'customer_decision': record,
                'status': quote_status,
                'pipeline_status': quote_status.upper()
            })
            # If shipment linked, update shipment too
            shipments_col = get_collection('shipments')
            if shipments_col is not None and q and q.get('shipment_id'):
                shipment_status = 'Confirmed' if decision == 'accepted' else 'Cancelled'
                shipments_col.update_one(
                    {'shipment_id': q.get('shipment_id')},
                    {'$set': {'status': shipment_status, 'pipeline_status': shipment_status.upper()}}
                )
        except Exception as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'ok': True,
            'quote_id': qid,
            'status': quote_status,
            'customer_decision': record
        }, status=status.HTTP_200_OK)


