"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from pong import views as pong_views
from flappy_fish import views as flappy_fish_views
from tuto_shooter import views as tuto_shooter_views


urlpatterns = [
    path('admin/', admin.site.urls),
	path('pong/', pong_views.pong_index),
	path('flappy_fish/', flappy_fish_views.flappy_fish_index),
	path('tuto_shooter/', tuto_shooter_views.tuto_shooter_index),
]