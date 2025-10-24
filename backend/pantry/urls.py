from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PantryItemViewSet, LocationViewSet, GroceryItemViewSet

router = DefaultRouter()
router.register(r'pantry', PantryItemViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'grocery', GroceryItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
