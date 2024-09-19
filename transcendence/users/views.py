# views.py
from django.views import generic
from django.shortcuts import redirect

from django.urls import reverse_lazy




from django.contrib.auth.views import PasswordChangeView

class ChangePasswordView(PasswordChangeView):
    template_name = 'users/change-password.html'
    success_url = reverse_lazy('home')




# Create your views here.
