from rest_framework import serializers
from .models import PantryItem, Location 


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class PantryItemSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

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
