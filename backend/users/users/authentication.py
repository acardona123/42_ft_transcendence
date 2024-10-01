from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission

class CustomJWTAuthentication(JWTAuthentication):
	def authenticate(self, request):
		validated_data = super().authenticate(request)
		if validated_data is None:
			return None
		user, token = validated_data
		scope = token.get('scope', None)
		if not scope:
			raise AuthenticationFailed('Token has no scope')
		return user, token

class IsTemporaryToken(BasePermission):
	def has_permission(self, request, view):
		if request.user == None or request.auth == None:
			return False
		token = request.auth
		if token and token.get('scope') == 'temporary':
			return True
		return False

class IsNormalToken(BasePermission):
	def has_permission(self, request, view):
		if request.user == None or request.auth == None:
			return False
		token = request.auth
		if token and token.get('scope') == 'normal':
			return True
		return False