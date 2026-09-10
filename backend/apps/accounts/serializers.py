from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    carrier_key = serializers.SerializerMethodField()
    carrier_desk = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    contract_tier = serializers.SerializerMethodField()
    sla_hours = serializers.SerializerMethodField()
    logo_color = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'name', 'company', 'carrier_key',
            'carrier_desk', 'role', 'phone', 'contract_tier', 'sla_hours', 'logo_color'
        )

    def _get_company_info(self, obj):
        if not hasattr(self, '_comp_cache'):
            self._comp_cache = {}
        email = (obj.email or obj.username or '').strip().lower()
        if email in self._comp_cache:
            return self._comp_cache[email]
            
        from core.storage import load_companies
        comp_match = None
        try:
            comps = load_companies()
            # 1. Match by agent email in company agents list
            for c in comps:
                if any((a.get('email') or '').strip().lower() == email for a in c.get('agents', [])):
                    comp_match = c
                    break
                if (c.get('manager_email') or '').strip().lower() == email:
                    comp_match = c
                    break
            # 2. Match by company name in profile
            if not comp_match and hasattr(obj, 'profile') and obj.profile.company:
                p_comp = obj.profile.company.replace('PORTLINE ', '').replace(' Desk', '').strip().lower()
                for c in comps:
                    if (c.get('name') or '').strip().lower() == p_comp or (c.get('carrier_key') or '').strip().lower() == p_comp:
                        comp_match = c
                        break
        except Exception:
            pass

        self._comp_cache[email] = comp_match
        return comp_match

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        if full:
            return full
        if obj.email:
            username_part = obj.email.split('@')[0]
            return ' '.join([p.capitalize() for p in username_part.replace('.', ' ').replace('_', ' ').split()])
        return 'Shipper'

    def get_company(self, obj):
        comp = self._get_company_info(obj)
        if comp and comp.get('name'):
            return comp.get('name')
        if hasattr(obj, 'profile') and obj.profile.company:
            return obj.profile.company
        return 'Independent Shipper'

    def get_carrier_key(self, obj):
        comp = self._get_company_info(obj)
        if comp and (comp.get('carrier_key') or comp.get('name')):
            return comp.get('carrier_key') or comp.get('name')
        if hasattr(obj, 'profile') and obj.profile.company:
            c = obj.profile.company.replace('PORTLINE ', '').replace(' Desk', '').strip()
            if c and c.lower() not in ('independent shipper', 'company', 'portline logistics (demo)'):
                return c
        return ''

    def get_carrier_desk(self, obj):
        comp = self._get_company_info(obj)
        if comp and comp.get('name'):
            return f"{comp.get('name')} Desk"
        if hasattr(obj, 'profile') and obj.profile.company:
            c = obj.profile.company.replace('PORTLINE ', '').replace(' Desk', '').strip()
            if c and c.lower() not in ('independent shipper', 'company', 'portline logistics (demo)'):
                return f"{c} Desk"
        return ''

    def get_role(self, obj):
        if hasattr(obj, 'profile') and obj.profile.role:
            return obj.profile.role
        return 'customer'

    def get_phone(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.phone
        return ''

    def get_contract_tier(self, obj):
        comp = self._get_company_info(obj)
        return comp.get('contract_tier', 'Tier 1 Strategic Carrier') if comp else 'Tier 1 Strategic Carrier'

    def get_sla_hours(self, obj):
        comp = self._get_company_info(obj)
        return comp.get('sla_hours', '2h SLA') if comp else '2h SLA'

    def get_logo_color(self, obj):
        comp = self._get_company_info(obj)
        return comp.get('logo_color', '#0A2540') if comp else '#0A2540'

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False)
    company = serializers.CharField(write_only=True, required=False)
    phone = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'name', 'company', 'phone')

    def create(self, validated_data):
        name = validated_data.pop('name', '').strip()
        company = validated_data.pop('company', '').strip() or 'Independent Shipper'
        phone = validated_data.pop('phone', '').strip()
        email = validated_data['email'].strip().lower()
        password = validated_data['password']

        names = name.split(' ') if name else []
        first_name = names[0] if len(names) > 0 else ''
        last_name = ' '.join(names[1:]) if len(names) > 1 else ''

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        UserProfile.objects.create(user=user, company=company, phone=phone, role='customer')
        return user
