"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from stats.views_public_api import get_user_stats

schema_view = get_schema_view(
	openapi.Info(
		title="api/stats",
		default_version='v1',
		description="All the call that can be done to the api stats",
	),
	public=True,
	#    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
	path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
	path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
	path("admin/", admin.site.urls),
	path("api/stats/", get_user_stats),
	path("api/private/stats/", include("stats.urls")),
]

# mettre private dant les urls d'api prive api/private/stats et pour le seul appel public mettre juste api/stats