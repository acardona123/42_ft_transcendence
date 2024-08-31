# views.py
from django.views import generic
from django.shortcuts import redirect
from django.contrib.auth import logout


from .forms import CustomUserCreationForm

from django.views.generic.edit import UpdateView
from django.urls import reverse_lazy
from .forms import CustomUserChangeForm
from .models import CustomUser

class SignUp(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "signup.html"

    def form_valid(self, form):
        response = super().form_valid(form)
        if 'profile_picture' in self.request.FILES:
            form.instance.profile_picture = self.request.FILES['profile_picture']
        return response

def logout_user(request):
	user = request.user
	logout(request)
	return redirect('home')  # Redirect to home page after logout


class UserProfileUpdateView(UpdateView):
    model = CustomUser
    form_class = CustomUserChangeForm
    template_name = 'update-profile.html'
    success_url = reverse_lazy('home')

    def get_object(self, queryset=None):
        return self.request.user
    
from django.contrib.auth.views import PasswordChangeView

class ChangePasswordView(PasswordChangeView):
    template_name = 'users/change-password.html'
    success_url = reverse_lazy('home')

# Create your views here.
