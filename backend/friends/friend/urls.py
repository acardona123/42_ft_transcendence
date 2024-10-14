from django.urls import path
from .views import friend_list, send_friend_request, remove_friend, manage_request, request_list
urlpatterns = [
    path("", friend_list, name='friend_list'),
    path("remove/<int:friendship_id>/", remove_friend, name='remove_friend'),

    path("request/", request_list, name='request_list'),
    path("request/send/", send_friend_request, name='send_friend_request'),
    path("request/<int:request_id>/", manage_request, name='manage_request'),
]