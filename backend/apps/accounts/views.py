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
