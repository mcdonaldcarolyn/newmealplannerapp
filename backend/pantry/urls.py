from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PantryItemViewSet

router = DefaultRouter()
router.register(r'pantry', PantryItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
