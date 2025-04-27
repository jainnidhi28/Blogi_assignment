from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework import generics, permissions, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .serializers import RegisterSerializer, UserDetailSerializer, UserProfileSerializer
from .models import User, UserProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from rest_framework.decorators import action

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['email', 'first_name', 'last_name']
    search_fields = ['email', 'first_name', 'last_name']

    def get_permissions(self):
        if self.action in ['list', 'destroy']:
            return [IsAdminUser()]
        if self.action in ['retrieve', 'update', 'partial_update', 'me']:
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_object(self):
        # Default: only allow user to access their own object unless admin
        obj = super().get_object()
        user = self.request.user
        if self.action in ['retrieve', 'update', 'partial_update'] and not user.is_staff:
            if obj != user:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You can only access your own user object.")
        return obj

    @action(detail=False, methods=['get', 'patch', 'put'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            return Response(self.get_serializer(request.user).data)
        serializer = self.get_serializer(request.user, data=request.data, partial=(request.method=='PATCH'), context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(self.get_serializer(request.user).data)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['get'], url_path='profile/(?P<email>[^/]+)', permission_classes=[AllowAny])
    def public_profile(self, request, email=None):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)
        return Response(self.get_serializer(user).data)
