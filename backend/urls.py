
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from pantry.views import PantryItemViewSet, LocationViewSet, GroceryItemViewSet
from mealplan.views import MealPlanViewSet


router = DefaultRouter()
router.register(r'pantry', PantryItemViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'grocery', GroceryItemViewSet)
router.register(r'mealplan', MealPlanViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

