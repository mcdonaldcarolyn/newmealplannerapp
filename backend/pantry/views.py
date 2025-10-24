from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import PantryItem, Location, GroceryItem
from .serializers import PantryItemSerializer, LocationSerializer, GroceryItemSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]  # Locations are shared across all users


class PantryItemViewSet(viewsets.ModelViewSet):
    queryset = PantryItem.objects.all()  # Base queryset (required for DRF routing)
    serializer_class = PantryItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return pantry items for the logged-in user
        return PantryItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user when creating a pantry item
        serializer.save(user=self.request.user)


class GroceryItemViewSet(viewsets.ModelViewSet):
    queryset = GroceryItem.objects.all()  # Base queryset (required for DRF routing)
    serializer_class = GroceryItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return grocery items for the logged-in user
        return GroceryItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user when creating a grocery item
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user account
    """
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    # Validate input
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if username already exists
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Create user
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        return Response(
            {
                'message': 'User created successfully',
                'username': user.username
            },
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )