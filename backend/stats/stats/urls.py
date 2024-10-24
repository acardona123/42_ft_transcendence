from django.urls import path
from .views_private_api import generate_match_data_stats, create_statistics_user

urlpatterns = [
	path("private/add_data_stats/", generate_match_data_stats), #pour match
	path("private/create_statistics_user/", create_statistics_user),
]