from django.urls import path
from .views import register_user, get_url_api, login_oauth, users
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView



urlpatterns = [
	path("signup/", register_user, name="register"),
	path("url/api42/", get_url_api, name="get_url_api"),
	path("login/api42/", login_oauth, name="login_api"),
	path("login/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
	path("token/refresh/",TokenRefreshView.as_view(), name='token_refresh'),
	# path("token/verify/", TokenVerifyView.as_view(), name='token_verify'),
	path("", users.as_view(), name="user"),
]