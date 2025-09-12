# mealplan/views.py
from rest_framework import viewsets
from .models import MealPlanItem
from .serializers import MealPlanSerializer

class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlanItem.objects.all()
    serializer_class = MealPlanSerializer


