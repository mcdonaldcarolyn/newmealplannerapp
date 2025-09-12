from rest_framework import serializers
from .models import MealPlanItem

class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlanItem
        fields = '__all__'

