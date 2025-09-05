from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from pantry.views import PantryItemViewSet

router = DefaultRouter()
router.register(r'pantry', PantryItemViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
