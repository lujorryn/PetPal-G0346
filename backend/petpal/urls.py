from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/accounts', include("accounts.urls", namespace="accounts")),
    path('api/shelters', include("shelters.urls", namespace="shelters")),
    path('api/seekers', include("seekers.urls", namespace="seekers")),
    path('api/petlistings', include("petlistings.urls", namespace="petlistings")),
    path('api/applications', include("applications.urls", namespace="applications")),
    path('api/comments', include("comments.urls", namespace="comments")),
    path('api/notifications', include("notifications.urls", namespace="notifications")),

    # For Simple JWT
    path('api/token/', TokenObtainPairView.as_view(), name='account-login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='account-login-refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
