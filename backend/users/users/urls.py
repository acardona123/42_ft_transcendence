from django.urls import path
from .views import (register_user, get_url_api, login_oauth, login_user, logout, refresh_token)
from .view_update import update_password, update_user_info
from .view_2fa import update_2fa, login_2fa, validate_2fa_enable

urlpatterns = [
	path("signup/", register_user, name="signup"),
	path("url/api42/", get_url_api, name="get_url_api"),
	path("login/api42/", login_oauth, name="login_api"),
	path("login/", login_user, name='login_user'),
	path("login/2fa/", login_2fa, name="login_2fa"),
	path("login/2fa/", login_2fa, name="login_2fa"),
	path("token/refresh/",refresh_token, name='token_refresh'),
	path("logout/", logout, name='logout'),
	path("update/password/", update_password, name="update_password"),
	path("update/user/", update_user_info, name="update_user"),
	path("update/2fa/", update_2fa, name="update_2fa"),
	path("update/2fa/validation/", validate_2fa_enable, name="validate_2fa_enable"),
]