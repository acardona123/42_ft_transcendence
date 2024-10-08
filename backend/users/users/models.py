from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from .manager import CustomUserManager
import uuid
import random
import re
from django.utils import timezone

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
    # picture = models.ImageField(blank=True, null=True)
	# profile_picture = models.ImageField(
	#     "profile picture",
	#     default='default_profile_picture.jpg',
	#     upload_to='profile_pictures/',
	#     validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
	# )

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