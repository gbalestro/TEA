from django.urls import path, include
from rest_framework import routers
from .views import PersonViewSet, LocationViewSet, TimeLogViewSet

router = routers.DefaultRouter()
router.register(r'people', PersonViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'logs', TimeLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
