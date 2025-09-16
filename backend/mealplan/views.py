# mealplan/views.py
from rest_framework import viewsets, permissions
from .models import MealPlanItem
from .serializers import MealPlanSerializer

class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlanItem.objects.all()
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PantryItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

