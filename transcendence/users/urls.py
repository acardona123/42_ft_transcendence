from django.urls import path
from . import views
from . import views_forms
from . import views_oauth


urlpatterns = [
	path("signup/", views_forms.SignUp.as_view(), name="signup"),
 
 
 
	path("auth/", views_oauth.auth, name="auth"),
	path("update-profile/", views_forms.UserProfileUpdateView.as_view(), name="update-profile"),
]