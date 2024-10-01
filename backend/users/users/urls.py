from django.urls import path
from .views import register_user, get_url_api, login_oauth, UserListView, update_password, update_user_info, login_user, update_2fa, check_2fa
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView, TokenBlacklistView



urlpatterns = [
	path("login/2fa/", check_2fa, name="login_2fa"),
	path("update/2fa/", update_2fa, name="update_2fa"),
	path("signup/", register_user, name="register"),
	path("login/", login_user, name='login_user'),
	path("url/api42/", get_url_api, name="get_url_api"),
	path("login/api42/", login_oauth, name="login_api"),
	path("token/refresh/",TokenRefreshView.as_view(), name='token_refresh'),
	path("logout/", TokenBlacklistView.as_view(), name='token_blacklist'),
	# path("token/verify/", TokenVerifyView.as_view(), name='token_verify'),
	path("update_password/", update_password, name="update_password"),
	path("update_user/", update_user_info, name="update_user"),
	path("", UserListView.as_view(), name="user"),
]