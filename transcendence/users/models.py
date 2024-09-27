from django.db import models
from django.core.validators import FileExtensionValidator

from django.contrib.auth.models import AbstractBaseUser
from .manager import CustomUserManager

# there is hidden an id 
class CustomUser(AbstractBaseUser):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField("email address", unique=True)
    phone = models.CharField(max_length=11, unique=True)
    profile_picture = models.ImageField(
        "profile picture",
        default='default_profile_picture.jpg',
        upload_to='profile_pictures/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    pin = models.CharField(max_length=6, default="0000", null=False)

    #is_connected

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()

    def __str__(self):
        return self.username
