from django.urls import path, include
from rest_framework import routers
from .views import PersonViewSet, LocationViewSet, TimeLogViewSet, UserViewSet, AuditEntryViewSet

router = routers.DefaultRouter()
router.register(r'people', PersonViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'logs', TimeLogViewSet)
router.register(r'users', UserViewSet)
router.register(r'audit-logs', AuditEntryViewSet, basename='audit-log')

urlpatterns = [
    path('', include(router.urls)),
]
