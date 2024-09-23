from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
	def create_user(self, **extra_fields):
		email = extra_fields.pop('email', None)
		password = extra_fields.pop('password', None)

		if not email:
			raise ValueError("The Email field is required")

		email = self.normalize_email(email)
		user = self.model(email=email, **extra_fields)
		user.set_password(password)
		user.save()
		return user

