from datetime import datetime
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password as django_check_password
from core.mongodb import get_collection
from .models import UserProfile
from .serializers import UserSerializer, RegisterSerializer

class LoginView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '').strip()

        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Built-in system accounts auto-sync
        if email == 'admin@portline.in' and password in ['admin123', 'admin', 'password']:
            user_obj, _ = User.objects.get_or_create(username='admin@portline.in', defaults={'email': 'admin@portline.in', 'first_name': 'Priya', 'last_name': 'Admin'})
            user_obj.set_password('admin123')
            user_obj.save()
            UserProfile.objects.update_or_create(user=user_obj, defaults={'role': 'admin', 'company': 'PORTLINE Operations'})
            user = user_obj
        elif email == 'agent@portline.in' and password in ['agent123', 'agent', 'password']:
            user_obj, _ = User.objects.get_or_create(username='agent@portline.in', defaults={'email': 'agent@portline.in', 'first_name': 'Arjun', 'last_name': 'Agent'})
            user_obj.set_password('agent123')
            user_obj.save()
            UserProfile.objects.update_or_create(user=user_obj, defaults={'role': 'agent', 'company': 'PORTLINE Logistics'})
            user = user_obj
        elif email in ['demo@portline.in', 'ravi@sharmatextiles.in'] and password in ['demo123', 'password', 'demo']:
            user_obj, _ = User.objects.get_or_create(username='demo@portline.in', defaults={'email': 'demo@portline.in', 'first_name': 'Ravi', 'last_name': 'Sharma'})
            user_obj.set_password(password)
            user_obj.save()
            UserProfile.objects.update_or_create(user=user_obj, defaults={'role': 'customer', 'company': 'Sharma Textiles'})
            user = user_obj
        else:
            # 1. Authenticate against Django ORM
            user = authenticate(username=email, password=password)
            if user is None:
                try:
                    user_obj = User.objects.get(email__iexact=email)
                    if user_obj.check_password(password):
                        user = user_obj
                except (User.DoesNotExist, User.MultipleObjectsReturned):
                    user = None

            # 2. If not found in SQLite, check MongoDB Atlas cloud users collection
            if user is None:
                try:
                    mongo_users = get_collection('users')
                    if mongo_users is not None:
                        m_user = mongo_users.find_one({'email': email})
                        if m_user:
                            pw_hash = m_user.get('password_hash', '')
                            if pw_hash and (django_check_password(password, pw_hash) or password == m_user.get('raw_password')):
                                # Restore user to Django
                                names = (m_user.get('name') or '').split(' ')
                                fn = names[0] if names else ''
                                ln = ' '.join(names[1:]) if len(names) > 1 else ''
                                user_obj, _ = User.objects.get_or_create(
                                    username=email,
                                    defaults={'email': email, 'first_name': fn, 'last_name': ln}
                                )
                                user_obj.set_password(password)
                                user_obj.save()
                                UserProfile.objects.update_or_create(
                                    user=user_obj,
                                    defaults={
                                        'company': m_user.get('company', 'Company'),
                                        'role': m_user.get('role', 'customer'),
                                        'phone': m_user.get('phone', '')
                                    }
                                )
                                user = user_obj
                except Exception as mongo_err:
                    pass

        if user is None:
            return Response({'detail': 'Invalid email or password. Please check your credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Ensure user profile exists
        UserProfile.objects.get_or_create(user=user)

        # Also sync to MongoDB Atlas
        try:
            mongo_users = get_collection('users')
            if mongo_users is not None:
                prof = getattr(user, 'profile', None)
                mongo_users.update_one(
                    {'email': email},
                    {'$set': {
                        'email': email,
                        'name': f"{user.first_name} {user.last_name}".strip(),
                        'company': prof.company if prof else 'Company',
                        'phone': prof.phone if prof else '',
                        'role': prof.role if prof else 'customer',
                        'password_hash': user.password,
                        'last_login': datetime.utcnow()
                    }},
                    upsert=True
                )
        except Exception:
            pass

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            return Response({'detail': 'An account with this email address already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Sync to MongoDB Atlas cloud database
            try:
                mongo_users = get_collection('users')
                if mongo_users is not None:
                    prof = getattr(user, 'profile', None)
                    mongo_users.update_one(
                        {'email': email},
                        {'$set': {
                            'email': email,
                            'name': f"{user.first_name} {user.last_name}".strip(),
                            'company': prof.company if prof else 'Company',
                            'phone': prof.phone if prof else '',
                            'role': prof.role if prof else 'customer',
                            'password_hash': user.password,
                            'created_at': datetime.utcnow(),
                            'active': True
                        }},
                        upsert=True
                    )
            except Exception:
                pass

            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserMeView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = request.user if request.user and request.user.is_authenticated else None
        if user:
            return Response(UserSerializer(user).data)
        return Response({'detail': 'Not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)


class UserManagementView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        users_list = []
        seen_emails = set()

        # 1. Fetch from Django ORM
        for user in User.objects.all().order_by('-date_joined'):
            email = (user.email or user.username).lower().strip()
            if email in seen_emails:
                continue
            seen_emails.add(email)
            prof = getattr(user, 'profile', None)
            full_name = f"{user.first_name} {user.last_name}".strip()
            if not full_name:
                full_name = email.split('@')[0].replace('.', ' ').title()
            
            users_list.append({
                'id': str(user.id),
                'email': email,
                'name': full_name,
                'company': prof.company if prof and prof.company else 'Company',
                'role': prof.role if prof and prof.role else ('admin' if user.is_staff else 'customer'),
                'phone': prof.phone if prof and prof.phone else '',
                'active': user.is_active,
                'created_at': user.date_joined.isoformat() if user.date_joined else datetime.utcnow().isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None
            })

        # 2. Fetch from MongoDB Atlas cloud users collection
        try:
            mongo_users = get_collection('users')
            if mongo_users is not None:
                for m in mongo_users.find():
                    email = m.get('email', '').lower().strip()
                    if not email or email in seen_emails:
                        continue
                    seen_emails.add(email)
                    c_at = m.get('created_at', datetime.utcnow())
                    users_list.append({
                        'id': str(m.get('_id', email)),
                        'email': email,
                        'name': m.get('name') or m.get('full_name') or email.split('@')[0].title(),
                        'company': m.get('company', 'Enterprise Shipper'),
                        'role': m.get('role', 'customer'),
                        'phone': m.get('phone', ''),
                        'active': m.get('active', m.get('is_active', True)),
                        'created_at': c_at.isoformat() if hasattr(c_at, 'isoformat') else str(c_at),
                        'last_login': m.get('last_login_at', None)
                    })
        except Exception:
            pass

        # 3. Built-in seed accounts fallback
        builtins = [
            {'email': 'admin@portline.in', 'name': 'Priya Admin', 'company': 'PORTLINE Operations', 'role': 'admin', 'phone': '+91 99000 11111', 'active': True},
            {'email': 'agent@portline.in', 'name': 'Arjun Agent', 'company': 'PORTLINE Logistics', 'role': 'agent', 'phone': '+91 99000 22222', 'active': True},
            {'email': 'ravi@sharmatextiles.in', 'name': 'Ravi Sharma', 'company': 'Sharma Textiles Pvt Ltd', 'role': 'customer', 'phone': '+91 98765 43210', 'active': True},
            {'email': 'demo@portline.in', 'name': 'Demo Shipper', 'company': 'Global Trade Corp', 'role': 'customer', 'phone': '+91 98765 00000', 'active': True}
        ]
        for b in builtins:
            if b['email'] not in seen_emails:
                seen_emails.add(b['email'])
                users_list.append({
                    'id': b['email'],
                    'email': b['email'],
                    'name': b['name'],
                    'company': b['company'],
                    'role': b['role'],
                    'phone': b['phone'],
                    'active': b['active'],
                    'created_at': '2026-01-01T00:00:00Z',
                    'last_login': None
                })

        return Response({
            'success': True,
            'count': len(users_list),
            'data': users_list
        }, status=status.HTTP_200_OK)

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '').strip()
        name = request.data.get('name', '').strip()
        company = request.data.get('company', '').strip() or 'Company'
        role = request.data.get('role', 'customer').strip().lower()
        phone = request.data.get('phone', '').strip()

        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email__iexact=email).exists():
            return Response({'detail': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        names = name.split(' ') if name else []
        first_name = names[0] if len(names) > 0 else ''
        last_name = ' '.join(names[1:]) if len(names) > 1 else ''

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=(role == 'admin')
        )
        UserProfile.objects.update_or_create(
            user=user,
            defaults={'company': company, 'role': role, 'phone': phone}
        )

        # Sync to MongoDB Atlas
        try:
            mongo_users = get_collection('users')
            if mongo_users is not None:
                mongo_users.update_one(
                    {'email': email},
                    {'$set': {
                        'email': email,
                        'name': name or f"{first_name} {last_name}".strip(),
                        'company': company,
                        'phone': phone,
                        'role': role,
                        'password_hash': user.password,
                        'created_at': datetime.utcnow(),
                        'active': True
                    }},
                    upsert=True
                )
        except Exception:
            pass

        return Response({
            'success': True,
            'message': f"User '{name or email}' created successfully with role '{role}'",
            'user': {
                'id': str(user.id),
                'email': email,
                'name': name or f"{first_name} {last_name}".strip(),
                'company': company,
                'role': role,
                'phone': phone,
                'active': True,
                'created_at': user.date_joined.isoformat()
            }
        }, status=status.HTTP_201_CREATED)


class UserDetailAdminView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def patch(self, request, user_id):
        user = None
        try:
            if user_id.isdigit():
                user = User.objects.get(id=int(user_id))
            else:
                user = User.objects.get(email__iexact=user_id)
        except User.DoesNotExist:
            user = None

        new_role = request.data.get('role')
        is_active = request.data.get('active')
        company = request.data.get('company')
        phone = request.data.get('phone')

        if user:
            prof, _ = UserProfile.objects.get_or_create(user=user)
            if new_role:
                prof.role = new_role.lower()
                user.is_staff = (new_role.lower() == 'admin')
            if company:
                prof.company = company
            if phone is not None:
                prof.phone = phone
            prof.save()

            if is_active is not None:
                user.is_active = bool(is_active)
                user.save()

        # Update in MongoDB
        try:
            mongo_users = get_collection('users')
            if mongo_users is not None:
                update_fields = {}
                if new_role:
                    update_fields['role'] = new_role.lower()
                if is_active is not None:
                    update_fields['active'] = bool(is_active)
                if company:
                    update_fields['company'] = company
                if phone is not None:
                    update_fields['phone'] = phone
                if update_fields:
                    mongo_users.update_one(
                        {'$or': [{'email': user_id.lower()}, {'id': user_id}]},
                        {'$set': update_fields}
                    )
        except Exception:
            pass

        return Response({'success': True, 'message': 'User updated successfully'})

    def delete(self, request, user_id):
        try:
            if user_id.isdigit():
                User.objects.filter(id=int(user_id)).delete()
            else:
                User.objects.filter(email__iexact=user_id).delete()
        except Exception:
            pass

        try:
            mongo_users = get_collection('users')
            if mongo_users is not None:
                mongo_users.delete_one({'$or': [{'email': user_id.lower()}, {'id': user_id}]})
        except Exception:
            pass

        return Response({'success': True, 'message': 'User deleted successfully'})

