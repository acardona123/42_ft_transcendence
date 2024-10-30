from django.contrib.auth.base_user import BaseUserManager
import requests

class CustomUserManager(BaseUserManager):
	use_in_migrations = True

	def _create_user(self, username, password=None, **extra_fields):
		if len(username) > 15:
			print(username)
			if '#' in username:
				username = username.split("#", 1)
				len_cut = 15 - len(username[1]) - 1
				print(len_cut)
				username = username[0][0: len_cut] + "#" + username[1]
				print(username)
		image_url = extra_fields.pop('profilepicture', None)
		if image_url != None:
			image_url = image_url.get('oauth_profile_picture')
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
		user.set_status_online()
		try:
			if user.type == user.UserType.USER:
				user.random_pin()
				user.create_profil_picture(url=image_url)
			else:
				user.pin = None
			self.create_stats_for_user(user.id)
			user.save()
		except Exception as error:
			self.model.objects.filter(username=username).delete()
			return None
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
	
	def create_stats_for_user(self, user_id):
		url = "http://stats:8006/api/private/stats/create_statistics_user/"
		response =requests.post(url=url, json={"player_id": user_id})
		if response.status_code != 201:
			raise