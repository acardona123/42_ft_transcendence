from django.db import models
from django.core.validators import FileExtensionValidator

from django.contrib.auth.models import AbstractBaseUser

from .managers import CustomUserManager

# there is hidden an id 
class CustomUser(AbstractBaseUser):
    email = models.EmailField("email address", unique=True)
    pseudo = models.CharField(max_length=20, unique=True)
    phone = models.CharField(max_length=11, unique=True)
    profile_picture = models.ImageField(
        "profile picture",
        default='default_profile_picture.jpg',
        upload_to='profile_pictures/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    is_active = models.BooleanField(default=True) #user.is_authenticated already exist maybe useless to have the boolean is_active

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

# Create your models here.
