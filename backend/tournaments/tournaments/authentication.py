from rest_framework.permissions import BasePermission

class IsNormalToken(BasePermission):
	def has_permission(self, request, view):
		if request.user == None or request.auth == None:
			return False
		token = request.auth
		if token and token.get('scope') == 'normal':
			return True
		return False