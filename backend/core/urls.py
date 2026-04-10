from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from tracking.views import CustomObtainAuthToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', CustomObtainAuthToken.as_view()),
    path('api/', include('tracking.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
