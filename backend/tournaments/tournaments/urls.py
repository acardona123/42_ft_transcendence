from django.urls import path
from .views import (create_tournament, ManagePlayer, start_tournament, guest_list,
		get_match_for_round, start_match_view)

urlpatterns = [
	path("create/", create_tournament),
	path("player/", ManagePlayer.as_view()),
	path("validate/", start_tournament),
	path("guests/", guest_list),
	path("round/", get_match_for_round),
	path("match/start/", start_match_view)
]