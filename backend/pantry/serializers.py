from rest_framework import serializers, viewsets, permissions 
from .models import PantryItem, Location, GroceryItem


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'
        read_only_fields = ["user"] 

class PantryItemSerializer(serializers.ModelSerializer):
    # This allows creating/updating pantry items with a location ID
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        source='location',
        write_only=True,
        required=False,
        allow_null=True
    )
    # This returns the full location object when reading
    location = LocationSerializer(read_only=True)

    class Meta:
        model = PantryItem
        fields = ['id', 'name', 'quantity', 'unit', 'location', 'location_id', 'user']
        read_only_fields = ["user"]

class GroceryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItem
        fields = '__all__'
        read_only_fields = ["user"]