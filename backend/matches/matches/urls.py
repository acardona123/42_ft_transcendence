from django.urls import path
from .views import match_history
from .views import test_create_matches, test_hello

urlpatterns = [
    # path("", list_matches, name='list_matches'),
    path("test_hello", test_hello, name='test'),
	path("test_create_bunk", test_create_matches, name='test_create_matches'),
    path("", match_history, name='list_matches'),
]