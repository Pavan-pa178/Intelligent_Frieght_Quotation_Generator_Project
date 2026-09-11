import uuid
from datetime import datetime
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from apps.accounts.models import UserProfile
from core import storage

def _enrich_company_stats(companies):
    all_quotes = storage.load_quotes()
    enriched = []
    for c in companies:
        c_copy = dict(c)
        c_name = (c.get('carrier_key') or c.get('name') or '').strip().lower()
        
        # Match quotes for this carrier
        matching = []
        for q in all_quotes:
            q_carrier = str(q.get('carrier') or q.get('selected_route', {}).get('carrier') or q.get('selectedCarrier') or '').strip().lower()
            if c_name and (c_name in q_carrier or q_carrier in c_name):
                matching.append(q)
        
        pending_count = sum(1 for q in matching if 'Pending' in str(q.get('status', '')) or 'Awaiting' in str(q.get('status', '')) or str(q.get('pipeline_status', '')).endswith('PENDING'))
        approved_count = sum(1 for q in matching if 'Approved' in str(q.get('status', '')) or 'Booked' in str(q.get('status', '')))
        booked_count = sum(1 for q in matching if str(q.get('status', '')) == 'Booked' or str(q.get('pipeline_status', '')) == 'BOOKED')
        
        c_copy['stats'] = {
            'total_requests': len(matching),
            'pending_verifications': pending_count,
            'approved_quotes': approved_count,
            'booked_shipments': booked_count,
            'active_agents_count': len(c.get('agents', []))
        }
        enriched.append(c_copy)
    return enriched

class CompanyListCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        companies = storage.load_companies()
        only_eligible = request.query_params.get('eligible', '').strip().lower() in ('true', '1')
        
        if only_eligible:
            companies = [c for c in companies if c.get('is_eligible', False) is True]
            
        enriched = _enrich_company_stats(companies)
        return Response(enriched)

    def post(self, request):
        data = request.data
        if not data or not data.get('name'):
            return Response({'detail': 'Company name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        carrier_key = data.get('carrier_key') or data.get('name')
        company_id = data.get('company_id') or f"COMP-{carrier_key.replace(' ', '').upper()[:4]}-{str(uuid.uuid4().hex[:4]).upper()}"
        
        # Determine service category
        service_category = data.get('service_category')
        if not service_category:
            modes_str = ' '.join(data.get('modes', [])) if isinstance(data.get('modes'), list) else str(data.get('modes', ''))
            all_text = (modes_str + ' ' + str(data.get('name', ''))).lower()
            if 'air' in all_text or 'express' in all_text:
                service_category = 'AIR'
            elif 'rail' in all_text or 'ground' in all_text or 'truck' in all_text or 'road' in all_text:
                service_category = 'GROUND_RAIL'
            else:
                service_category = 'OCEAN'

        new_company = {
            'company_id': company_id,
            'name': data.get('name').strip(),
            'carrier_key': carrier_key.strip(),
            'service_category': service_category,
            'modes': data.get('modes', ['Ocean FCL', 'Ocean LCL']) if isinstance(data.get('modes'), list) else [m.strip() for m in str(data.get('modes', '')).split(',') if m.strip()],
            'status': data.get('status', 'PENDING'),
            'is_eligible': data.get('is_eligible', False),
            'contract_tier': data.get('contract_tier', 'Standard Verified Partner'),
            'sla_hours': data.get('sla_hours', '2h Standard SLA'),
            'manager_email': data.get('manager_email', ''),
            'logo_color': data.get('logo_color', '#0A2540'),
            'agents': data.get('agents', []),
            'created_at': datetime.utcnow().isoformat() + 'Z'
        }
        
        saved = storage.save_company(new_company)
        return Response(saved, status=status.HTTP_201_CREATED)

class CompanyDetailVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, company_id):
        comp = storage.get_company_by_id(company_id)
        if not comp:
            return Response({'detail': f'Company {company_id} not found.'}, status=status.HTTP_404_NOT_FOUND)
        enriched = _enrich_company_stats([comp])[0]
        return Response(enriched)

    def patch(self, request, company_id):
        comp = storage.get_company_by_id(company_id)
        if not comp:
            return Response({'detail': f'Company {company_id} not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        update_fields = {}
        if 'status' in request.data:
            update_fields['status'] = request.data['status'].upper()
            if update_fields['status'] == 'APPROVED':
                update_fields['is_eligible'] = True
            elif update_fields['status'] in ('SUSPENDED', 'PENDING', 'REJECTED'):
                update_fields['is_eligible'] = False

        if 'is_eligible' in request.data:
            update_fields['is_eligible'] = bool(request.data['is_eligible'])
            if update_fields['is_eligible']:
                update_fields['status'] = 'APPROVED'
            else:
                if 'status' not in update_fields:
                    update_fields['status'] = 'SUSPENDED'

        for f in ('contract_tier', 'sla_hours', 'manager_email', 'modes'):
            if f in request.data:
                update_fields[f] = request.data[f]

        updated = storage.update_company(company_id, update_fields)
        enriched = _enrich_company_stats([updated])[0]
        return Response(enriched)

    def post(self, request, company_id):
        return self.patch(request, company_id)

class CompanyAgentManagementView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, company_id):
        comp = storage.get_company_by_id(company_id)
        if not comp:
            return Response({'detail': f'Company {company_id} not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '').strip()
        phone = request.data.get('phone', '').strip()
        
        if not email or not password:
            return Response({'detail': 'Agent email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 1. Create or update Django auth user account for this agent
        try:
            names = (name or email.split('@')[0]).split(' ')
            fn = names[0] if names else 'Agent'
            ln = ' '.join(names[1:]) if len(names) > 1 else (comp.get('carrier_key') or 'Carrier')
            
            user_obj, _ = User.objects.get_or_create(username=email, defaults={'email': email, 'first_name': fn, 'last_name': ln})
            user_obj.set_password(password)
            user_obj.save()
            
            UserProfile.objects.update_or_create(
                user=user_obj,
                defaults={
                    'role': 'agent',
                    'company': comp.get('name') or comp.get('carrier_key') or 'Carrier',
                    'phone': phone
                }
            )
        except Exception as e:
            return Response({'detail': f'Failed to register agent login: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # 2. Add agent to the company record
        agent_record = {
            'name': name or f"{fn} {ln}".strip(),
            'email': email,
            'role': 'agent',
            'phone': phone or '+91 98200 00000',
            'status': 'ACTIVE',
            'created_at': datetime.utcnow().isoformat() + 'Z'
        }
        
        updated_comp = storage.add_agent_to_company(company_id, agent_record)
        enriched = _enrich_company_stats([updated_comp])[0]
        return Response({
            'ok': True,
            'message': f"Agent {email} successfully onboarded to {comp.get('name')}",
            'agent': agent_record,
            'company': enriched
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, company_id):
        agent_email = request.query_params.get('email', '').strip().lower() or request.data.get('email', '').strip().lower()
        if not agent_email:
            return Response({'detail': 'Agent email is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        removed = storage.remove_agent_from_company(company_id, agent_email)
        comp = storage.get_company_by_id(company_id)
        enriched = _enrich_company_stats([comp])[0] if comp else None
        return Response({
            'ok': True,
            'message': f'Agent {agent_email} removed from company.',
            'company': enriched
        })
