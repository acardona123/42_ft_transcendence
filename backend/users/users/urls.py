from django.urls import path
from .views import register_user, get_url_api, login_oauth, UserListView, update_password, update_user_info
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView



urlpatterns = [
	path("signup/", register_user, name="register"),
	path("login/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
	path("url/api42/", get_url_api, name="get_url_api"),
	path("login/api42/", login_oauth, name="login_api"),
	path("token/refresh/",TokenRefreshView.as_view(), name='token_refresh'),
	# path("token/verify/", TokenVerifyView.as_view(), name='token_verify'),
	path("update_password/", update_password, name="update_password"),
	path("update_user/", update_user_info, name="update_user"),
	path("", UserListView.as_view(), name="user"),
]