from django.urls import path
from .views_public_api import match_history, new_match_against_ai, new_match_against_guest, new_match_against_player, finish_match
from .views_private_api import new_match_verified_id
from .views_test import test_create_matches, test_hello, test_delete_all_matches, test_finish_all_matches

urlpatterns = [
    # path("", list_matches, name='list_matches'),
    path("api/matches/", match_history, name='list_matches'),
    path("api/matches/new/me-ai/", new_match_against_ai, name='new_match_against_ai'),
    path("api/matches/new/me-guest/", new_match_against_guest, name='new_match_against_guest'),
    path("api/matches/new/me-player/", new_match_against_player, name='new_match_against_player'),
	
    path("api/matches/finish/<int:match_id>/", finish_match, name='finish_match'),

    # path("api/matches/test/hello/", test_hello, name='test_hello'),
	# path("api/matches/test/create_bunk/", test_create_matches, name='test_create_matches'),
	# path("api/matches/test/delete_all/", test_delete_all_matches, name='test_delete_all_matches'),
	# path("api/matches/test/finish_all/", test_finish_all_matches, name='test_finish_all_matches'),

	path("api/private/matches/new_match_verified_id/", new_match_verified_id, name='new_match_verified_id'),
	


]