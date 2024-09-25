from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .manager import CustomUserManager

# there is hidden an id 
class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = PhoneNumberField(unique=True, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    # picture = models.ImageField(blank=True, null=True)
	# profile_picture = models.ImageField(
	#     "profile picture",
	#     default='default_profile_picture.jpg',
	#     upload_to='profile_pictures/',
	#     validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
	# )
    #is_connected
    #code match

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
