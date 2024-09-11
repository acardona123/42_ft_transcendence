from django.urls import path
from .views import friend_list, send_friend_request, remove_friend, accept_request, reject_request, request_list
urlpatterns = [
    path("", friend_list, name='friend_list'),
    path("remove/<int:friendship_id>/", remove_friend, name='remove_friend'),
    path("request", request_list, name='request_list'),
    path("request/send/", send_friend_request, name='send_friend_request'),
    path("request/accept/<int:request_id>/", accept_request, name='accept_request'),
    path("request/reject/<int:request_id>/", reject_request, name='reject_request'),
]