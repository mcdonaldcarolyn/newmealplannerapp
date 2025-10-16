from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import PantryItem, Location, GroceryItem
from .serializers import PantryItemSerializer, LocationSerializer, GroceryItemSerializer
from rest_framework.permissions import AllowAny

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]


class PantryItemViewSet(viewsets.ModelViewSet):
    queryset = PantryItem.objects.all()
    serializer_class = PantryItemSerializer
    permission_classes = [AllowAny]

class GroceryItemViewSet(viewsets.ModelViewSet):
    queryset = GroceryItem.objects.all()
    serializer_class = GroceryItemSerializer
    permission_classes = [AllowAny]