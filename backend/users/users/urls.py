from django.urls import path
from . import views


urlpatterns = [
	path("signup/", views.SignUp.as_view(), name="signup"),
	
	path("login/", views.Login.as_view(), name="login"),
 
 
 
	# path("auth/", views_oauth.auth, name="auth"),
	path("update-profile/", views.UserProfileUpdateView.as_view(), name="update-profile"),
]