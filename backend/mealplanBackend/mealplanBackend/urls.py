from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from mealplan.views import MealPlanViewSet  # adjust if your app is named differently

router = DefaultRouter()
router.register(r'mealplan', MealPlanViewSet)  # your API endpoints

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # REST API routes
]


