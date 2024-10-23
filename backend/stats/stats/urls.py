from django.urls import path
from .views_private_api import generate_match_data_stats

urlpatterns = [
	path("private/get_data_stats/", generate_match_data_stats), #a mettre sur match
]