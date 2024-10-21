from .authentication import IsTemporaryToken, IsNormalToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .utils import generate_qr_code, get_tokens_for_user
from django_otp.plugins.otp_totp.models import TOTPDevice
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView

from .doc import (JWT_TOKEN, MSG_ERROR_TOKEN_REQUIRED, 	
		MSG_ERROR_NO_TOTP_DEVICE, MSG_2FA_STATUS, MSG_ERROR_UPDATE_2FA_OAUTH,
		MSG_ERROR_WRONG_TOKEN, MSG_LOGIN, MSG_ERROR_WRONG_2FA_STATUS,
		MSG_ERROR_2FA_IS_DISABLE,MSG_DISABLE_2FA, MSG_ENABLE_2FA,
		MSG_ERROR_DEVICE_NOT_CONFIRMED, MSG_DEVICE_ALREADY_CONFIRMED,
		MSG_DEVICE_VALIDATED,  DOC_2FA_VALID, DOC_ERROR_INVALID_2FA,
		DOC_ERROR_WRONG_2FA_STATUS, DOC_DISABLE_2FA, DOC_ENABLE_2FA,
		DOC_2FA_DEVIDE_ALREADY_VALID, DOC_2FA_DEVIDE_VALID, 
		DOC_ERROR_UNAUTHORIZED, DOC_2FA_STATUS,
		DOC_ERROR_METHOD_NOT_ALLOWED)

@swagger_auto_schema(method='post',
	manual_parameters=[JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['token'],
		properties={
			'token': openapi.Schema(type=openapi.TYPE_STRING, description='6 digits'),
		}
	),
	responses={
		200: DOC_2FA_VALID,
		400: DOC_ERROR_INVALID_2FA,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
@permission_classes([IsTemporaryToken])
def login_2fa(request):
	token_2fa = request.data.get("token", None)
	if token_2fa is None:
		return Response({"message": MSG_ERROR_TOKEN_REQUIRED}, status=400)
	user = request.user
	if not user.is_2fa_enable:
		return Response({"message": MSG_ERROR_2FA_IS_DISABLE}, status=400)
	device = TOTPDevice.objects.filter(user=user).first()
	if device == None:
		return Response({"message": MSG_ERROR_NO_TOTP_DEVICE}, status=400)
	if not device.confirmed:
		return Response({"message": MSG_ERROR_DEVICE_NOT_CONFIRMED}, status=400)
	if device.verify_token(token_2fa):
		user.set_status_online()
		token = get_tokens_for_user(user)
		return Response({"message": MSG_LOGIN,
						"data": token}, status=200)
	return Response({"message": MSG_ERROR_WRONG_TOKEN}, status=400)

class Update2fa(APIView):
	permission_classes = [IsNormalToken]

	@swagger_auto_schema(
		manual_parameters=[JWT_TOKEN],
		request_body=openapi.Schema(
			type=openapi.TYPE_OBJECT,
			required=['2fa_status'],
			properties={
				'2fa_status': openapi.Schema(type=openapi.TYPE_STRING, description="on or off"),
			}
		),
		responses={
			200: DOC_DISABLE_2FA,
			201: DOC_ENABLE_2FA,
			400: DOC_ERROR_WRONG_2FA_STATUS,
			401: DOC_ERROR_UNAUTHORIZED,
			405: DOC_ERROR_METHOD_NOT_ALLOWED,
		})
	def put(self, request):
		status_2fa = request.data.get("2fa_status", None)
		user = request.user
		if request.user.oauth_id is not None:
			return Response({"message": MSG_ERROR_UPDATE_2FA_OAUTH}, status=400)
		if status_2fa not in ('on', 'off'):
			return Response({"message": MSG_ERROR_WRONG_2FA_STATUS}, status=400)
		if status_2fa == 'off':
			user.is_2fa_enable = False
			user.save()
			TOTPDevice.objects.filter(user=user).delete()
			return Response({"message": MSG_DISABLE_2FA,
							"data": {"2fa_status" : "off"}}, status=200)
		else:
			user.is_2fa_enable = True
			user.save()
			if TOTPDevice.objects.filter(user=user).exists():
				TOTPDevice.objects.filter(user=user).delete()
			device = TOTPDevice.objects.create(user=user, name='default', confirmed=False)
			secret_code = device.config_url.split("secret=")[1].split('&')[0]
			qr_code = generate_qr_code(device.config_url)
			return Response({"message": MSG_ENABLE_2FA,
							"data": {"2fa_status" : "waiting",
									"code": secret_code,
									"qrcode" :f"data:image/png;base64,{qr_code}"}}, status=201)

	@swagger_auto_schema(
		manual_parameters=[JWT_TOKEN],
		responses={
			200: DOC_2FA_STATUS,
			401: DOC_ERROR_UNAUTHORIZED,
			405: DOC_ERROR_METHOD_NOT_ALLOWED,
		})
	def get(self, request):
		status = request.user.is_2fa_enable and TOTPDevice.objects.filter(user=request.user).first().confirmed
		return Response({"message": MSG_2FA_STATUS,
						"data": {"2fa_status" : "on" if status else "off"}})

@swagger_auto_schema(method='put',
	manual_parameters=[JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['token'],
		properties={
			'token': openapi.Schema(type=openapi.TYPE_STRING, description='6 digits'),
		}
	),
	responses={
		200: DOC_2FA_DEVIDE_VALID,
		'200bis': DOC_2FA_DEVIDE_ALREADY_VALID,
		400: DOC_ERROR_INVALID_2FA,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['PUT'])
@permission_classes([IsNormalToken])
def validate_2fa_enable(request):
	token_2fa = request.data.get("token", None)
	if token_2fa is None:
		return Response({"message": MSG_ERROR_TOKEN_REQUIRED}, status=400)
	user = request.user
	if not user.is_2fa_enable:
		return Response({"message": MSG_ERROR_2FA_IS_DISABLE}, status=400)
	device = TOTPDevice.objects.filter(user=user).first()
	if device == None:
		return Response({"message": MSG_ERROR_NO_TOTP_DEVICE}, status=400)
	if device.verify_token(token_2fa):
		if device.confirmed:
			return Response({"message": MSG_DEVICE_ALREADY_CONFIRMED}, status=200)
		device.confirmed = True
		device.save()
		return Response({"message": MSG_DEVICE_VALIDATED,
						"data": {"2fa_status" : "on"}}, status=200)
	return Response({"message": MSG_ERROR_WRONG_TOKEN}, status=400)
