# project/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealPlanViewSet

router = DefaultRouter()
router.register(r'mealplan', MealPlanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]