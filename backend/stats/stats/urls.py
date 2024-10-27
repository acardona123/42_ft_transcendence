from django.urls import path
from .views_private_api import generate_match_data_stats, create_statistics_user, generate_tournament_data_stats
from .views_public_api import get_user_stats

urlpatterns = [
	path("private/create_statistics_user/", create_statistics_user, name="create_stats_user"),
	path("private/post_match_data/", generate_match_data_stats, name="update_match_stats_user"),
	path("private/post_tournament_data/", generate_tournament_data_stats, name="update_tournament_stats_user"),
	path("", get_user_stats),
]