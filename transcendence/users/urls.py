from django.urls import path
from . import views
from . import views_forms
from . import views_oauth
from . import views_api


urlpatterns = [
	path("api/", views_api.get_users, name="get_user"),
	path("api/<int:id>", views_api.user_detail),
	path("api/<str:username>/", views_api.get_user_id),
	path("api/profile_picture/<int:id>", views_api.get_user_profile_picture),
	
	path("signup/", views_forms.SignUp.as_view(), name="signup"),
	path("auth/", views_oauth.auth, name="auth"),
	path("update-profile/", views_forms.UserProfileUpdateView.as_view(), name="update-profile"),
]