from django.urls import path
from .views import register_user#, get_url_api, login_oauth


urlpatterns = [
	path("signup/", register_user, name="register"),
	# path("url/api42/", get_url_api, name="get_url_api"),
	# path("login/api42/", login_oauth, name="login_api"),
]