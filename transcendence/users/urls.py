from django.urls import path
from . import views
from . import views_forms
from . import views_oauth
from . import views_api


urlpatterns = [
	path("api/", views_api.get_users, name="get_user"),
	path("api/<int:pk>", views_api.user_detail),
	path("api/<str:username>/", views_api.get_user_id),
	path("signup/", views_forms.SignUp.as_view(), name="signup"),
	path("auth/", views_oauth.auth, name="auth"),
	path("update-profile/", views_forms.UserProfileUpdateView.as_view(), name="update-profile"),
]