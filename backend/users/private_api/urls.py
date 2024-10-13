from django.urls import path
from .views import (get_username_by_id, create_ai, create_guest, get_type_user,
	check_pin_code, get_friend_info_by_id)

urlpatterns = [
	path("retrieve/usernames/", get_username_by_id, name="get_username_by_id"),
	path("retrieve/friends_info/", get_friend_info_by_id, name="get_friend_info_by_id"),
	path("new/player/ai/", create_ai, name="create_ai"),
	path("new/player/guest/", create_guest, name="create_guest"),
	path("<int:user_id>/type/", get_type_user, name="get_type_user"),
	path("login/pin/", check_pin_code, name="check_pin_code"),
]