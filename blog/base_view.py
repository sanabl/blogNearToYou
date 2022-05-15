from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny,IsAuthenticated


class AuthenticatedViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]


class PublicViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]