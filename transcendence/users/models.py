from django.db import models
from django.core.validators import FileExtensionValidator

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager

# there is hidden an id 
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    pseudo = models.CharField(max_length=20)
    phone = models.CharField(max_length=12)
    profile_picture = models.ImageField(
        _("profile picture"),
        default='default_profile_picture.jpg',
        upload_to='profile_pictures/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    is_connected = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

# Create your models here.
