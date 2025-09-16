from rest_framework import serializers
from .models import PantryItem, Location, GroceryItem


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'
        read_only_fields = ["user"] 

class PantryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PantryItem
        fields = '__all__'
        read_only_fields = ["user"]

    # This allows creating/updating pantry items with a location ID
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        source='location',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = PantryItem
        fields = ['id', 'name', 'quantity', 'unit', 'location', 'location_id']

class GroceryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItem
        fields = '__all__'
        read_only_fields = ["user"]