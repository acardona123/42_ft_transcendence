from django.urls import reverse_lazy
from django.views import generic
# from django.contrib import messages
# from django.contrib.auth import logout

from .forms import CustomUserCreationForm


class SignUp(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "signup.html"

    def form_valid(self, form):
        response = super().form_valid(form)
        if 'profile_picture' in self.request.FILES:
            form.instance.profile_picture = self.request.FILES['profile_picture']
        return response
# Create your views here.

# def logout_user(request):
# 	logout(request)
    