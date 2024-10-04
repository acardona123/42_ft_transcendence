from django.urls import path
from .views import register_user, get_url_api, login_oauth, update_password, update_user_info, login_user, update_2fa, check_2fa, logout, refresh_token



urlpatterns = [
	path("signup/", register_user, name="signup"),
	path("url/api42/", get_url_api, name="get_url_api"),
	path("login/api42/", login_oauth, name="login_api"),
	path("login/", login_user, name='login_user'),
	path("login/2fa/", check_2fa, name="login_2fa"),
	path("token/refresh/",refresh_token, name='token_refresh'),
	path("logout/", logout, name='logout'),
	path("update/password/", update_password, name="update_password"),
	path("update/user/", update_user_info, name="update_user"),
	path("update/2fa/", update_2fa, name="update_2fa")
]