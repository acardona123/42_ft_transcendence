from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from .manager import CustomUserManager
import uuid
import random
import re
import os
from django.utils import timezone
from datetime import timedelta
from app.settings import TIME_TIMEOUT
from django.core.validators import FileExtensionValidator

def test_username(username):
    if re.match("^[A-Za-z0-9_#-]*$", username):
        return username
    else:
        raise ValidationError("Username must contains only letters, digits, _ or -")

class CustomUser(AbstractBaseUser, PermissionsMixin):
    # id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    class UserType(models.TextChoices):
        GST = "Guest"
        BOT = "Bot"
        USR = "User"

    type = models.CharField(max_length=5, choices=UserType.choices, default=UserType.USR)
    username = models.CharField(max_length=150, unique=True,
                            validators=[test_username])
    email = models.EmailField(null=True)
    phone = PhoneNumberField(null=True)
    is_staff = models.BooleanField(default=False)
    oauth_id = models.IntegerField(null=True, unique=True)
    is_2fa_enable = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    last_activity = models.DateTimeField()
    pin = models.CharField(max_length=4, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    def set_status_online(self):
        self.is_online = True
        self.last_activity = timezone.now()
        self.save()

    def set_last_acticity(self):
        self.last_activity = timezone.now()
        self.save()

    def random_pin(self):
        self.pin = f"{random.randint(0000, 9999):04d}"
    
    def create_profil_picture(self, url=None):
        ProfilePicture.objects.create(user=self, oauth_profile_picture=url)

    def get_picture(self):
        if not (hasattr(self, 'profilepicture') and self.profilepicture):
            return None
        return self.profilepicture.get_picture()

    def get_status(self):
        if not self.is_online:
            return "offline"
        elif (timezone.now() - self.last_activity) > TIME_TIMEOUT:
            return "inactif"
        else:
            return "online"

DEFAULT_IMAGE = 'profile_pictures/default.jpg'

def upload_path(instance, filename):
    ext = filename.split('.')[-1]
    return f"profile_pictures/{instance.user.id}_{uuid.uuid4().hex}.{ext}"

class ProfilePicture(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    profile_picture = models.ImageField(
        "profile picture",
        default=DEFAULT_IMAGE,
        upload_to=upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    oauth_profile_picture = models.URLField(null=True, blank=True)

    def remove_old_picture(self):
        image_path = self.profile_picture.path
        if self.profile_picture.name == DEFAULT_IMAGE:
            return True
        try:
            if os.path.exists(image_path):
                os.remove(image_path)
            return True
        except:
            return False
    
    def get_picture(self):
        if self.oauth_profile_picture:
            return self.oauth_profile_picture
        elif self.profile_picture:
            return f"https://localhost:8443{self.profile_picture.url}"
        else:
            return None