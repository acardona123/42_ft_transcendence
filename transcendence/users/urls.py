from django.urls import path
from . import views
from .views import UserProfileUpdateView


urlpatterns = [
	path("signup/", views.SignUp.as_view(), name="signup"),
	path("logout/", views.logout_user, name="logout"),
	 path('update-profile/', UserProfileUpdateView.as_view(), name='update-profile'),
]