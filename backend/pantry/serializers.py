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

    class Meta:
        model = PantryItem
        fields = ['id', 'name', 'quantity', 'unit', 'location', 'location_id', 'user']
        read_only_fields = ["user"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return PantryItem.objects.create(user=request.user, **validated_data)
        return PantryItem.objects.create(**validated_data)

class GroceryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItem
        fields = '__all__'
        read_only_fields = ["user"]