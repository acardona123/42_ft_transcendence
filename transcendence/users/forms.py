from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
import json
from .models import CustomUser


class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="Password")
    password2 = forms.CharField(label="Password confirmation")

    class Meta:
        model = CustomUser
        fields = ("email", "pseudo", "phone", "profile_picture")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])  # This hashes the password
        if commit:
            user.save()
        return user

    def as_json(self):
        if self.is_valid():
            return json.dumps(self.cleaned_data)
        else:
            return json.dumps({"errors": self.errors})
    
    def clean_phone(self):
        phone = self.cleaned_data.get("phone")
        if not phone.isdigit():
            raise forms.ValidationError("Phone number must contain only digits.")
        return phone

class CustomUserChangeForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ("email", "pseudo", "phone", "profile_picture")

    def clean_phone(self):
        phone = self.cleaned_data.get("phone")
        if not phone.isdigit():
            raise forms.ValidationError("Phone number must contain only digits.")
        return phone
