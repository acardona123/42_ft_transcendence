from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
	def create_user(self, password, email=None, **extra_field):
		print('coucou')
		if extra_field.get('email'):
			email = self.normalize_email(extra_field.get('email'))
			user = self.model(email=email, **extra_field)
		else:
			user = self.model(**extra_field)
		user.set_password(password)
		user.save()
		print('test')
		return user

