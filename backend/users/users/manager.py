from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
	use_in_migrations = True

	def _create_user(self, username, password=None, **extra_fields):
		if extra_fields.get('email'):
			email = extra_fields.pop('email', None)
			email = self.normalize_email(email)
			user = self.model(username=username, email=email, **extra_fields)
		else:
			user = self.model(username=username, **extra_fields)
		if password == None:
			user.set_unusable_password()
		else:
			user.set_password(password)
		user.save()
		return user

	def create_user(self, username, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', False)
		extra_fields.setdefault('is_superuser', False)
		return self._create_user(username, password, **extra_fields)

	def create_superuser(self, username, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)

		if extra_fields.get('is_staff') is not True:
			raise ValueError('Superuser must have is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must have is_superuser=True.')

		return self._create_user(username, password, **extra_fields)