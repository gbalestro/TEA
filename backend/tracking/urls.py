from django.urls import path, include
from rest_framework import routers
from .views import PersonViewSet, LocationViewSet, TimeLogViewSet, UserViewSet

router = routers.DefaultRouter()
router.register(r'people', PersonViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'logs', TimeLogViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
