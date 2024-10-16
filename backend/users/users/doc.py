MSG_ERROR_CREATING_USER = "Error occured while creating user"
MSG_ERROR_NO_ACCOUNT = "No active account found with the given credentials"
MSG_ERROR_TOKEN_REQUIRED = "Token is required to authenticate with 2fa"
MSG_ERROR_REFRESH_REQUIRED = "Refresh field is required"
MSG_ERROR_NO_TOTP_DEVICE = "Not device found for user"
MSG_ERROR_WRONG_TOKEN = "Fail to verify the token given"
MSG_ERROR_WRONG_2FA_STATUS = "Invalid status field for the 2fa"
MSG_ERROR_2FA_IS_DISABLE = "User have 2fa disable"
MSG_ERROR_OAUTH_LOGIN = "Unauthorized to login with API 42"
MSG_ERROR_OAUTH_INFO = "Unauthorized to retreive info with API 42"
MSG_ERROR_UPDATE_PASSWORD_OAUTH = "Impossible to update password with 42 API"
MSG_ERROR_UPDATE_PASSWORD = "Error occured while updating password"
MSG_ERROR_UPDATE_USER_INFO = "Error occured while updating user info"
MSG_ERROR_CREATING_USER_OAUTH = "Invalid data to create new user with 42 API"
MSG_ERROR_SER_INVALID_PASSWORD = "Password fields didn't match"
MSG_ERROR_SER_PASSWORD_EMPTY = "Password fields empty"
MSG_ERROR_SER_CURRENT_PASSWORD = "New Password is the current password"
MSG_ERROR_SER_NO_USER = "Invalid user"
MSG_ERROR_SER_USER_WITHOUT_PASSWORD = "User don't have any password"
MSG_ERROR_SER_OLD_PASSWORD = "Old password is not correct"
MSG_ERROR_INVALID_REFRESH_TOKEN = "Invalid refresh token"
MSG_ERROR_DEVICE_NOT_CONFIRMED = "Device 2fa is not confirmed"
MSG_ERROR_NO_IMAGE = "No image saved for this user"
MSG_ERROR_UPDATING_IMAGE = "Error while updating image"
MSG_ERROR_CODE_STATE_REQUIRED = "The fields 'state' and 'code' are required"

MSG_USER_CREATED = "User created"
MSG_LOGIN_NEED_2FA = "User login successfully, need to validate 2fa"
MSG_LOGIN = "User login successfully"
MSG_LOGOUT = "User logout successfully"
MSG_TOKEN_REFRESH = "Token refresh successfully"
MSG_LOGIN_OAUTH = "User login successfully with 42 API"
MSG_DISABLE_2FA = "Disable 2fa and remove previous devide"
MSG_ENABLE_2FA = "Enable 2fa and generate qr code to connect"
MSG_SEND_URL_OAUTH = "Send url to oauth2.0 with 42 API"
MSG_PASSWORD_UPDATE = "Password updated"
MSG_INFO_USER_UPDATE = "User info updated"
MSG_USER_OAUTH_CREATED = "New user created with 42 API"
MSG_DEVICE_ALREADY_CONFIRMED = "Device 2fa is already confirmed"
MSG_DEVICE_VALIDATED = "Validation 2fa device"
MSG_USER_INFO = "User info that can be updated"
MSG_2FA_STATUS =  "Get 2fa status"
MSG_PICTURE_URL = "Get url of the profile picture"
MSG_UPDATE_PICTURE = "Update profile picture successfully"

#--------------------DOC--------------------
from drf_yasg import openapi

DOC_ERROR_METHOD_NOT_ALLOWED = openapi.Response(
			description="Method Not Allowed",
			examples={
				"application/json": {
					"detail": "Method \"PUT\" not allowed."
					}
			}
		)

DOC_ERROR_UNAUTHORIZED = openapi.Response(
			description="Unauthorized to access the page, need to have jwt",
			examples={
				"application/json": {
					"detail": "Given token not valid for any token type",
					"code": "token_not_valid",
					"messages": [
						{
						"token_class": "AccessToken",
						"token_type": "access",
						"message": "Token is invalid or expired"
						}
					]
				}
			}
		)

DOC_USER_CREATED = openapi.Response(
			description="return user created, token => refresh and access",
			examples={
				"application/json": {
					"message": MSG_USER_CREATED,
					"data": {
						"user": {
							"id": 4,
							"email": "a@gmai.com",
							"phone": "+33659482658",
							"username": "coucou"
						},
						"tokens": {
							"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzk3MTIxNSwiaWF0IjoxNzI3ODg0ODE1LCJqdGkiOiJkYzQwNjJjYzM5YTY0YWFhOTg1MDNkYjRkMTJiYmNiYiIsInVzZXJfaWQiOjQsInNjb3BlIjoibm9ybWFsIn0.yvWIU2TLw681zjQje7UZ1bPEqnhFmgoJODzlbhTHwVg",
							"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODg1NzE1LCJpYXQiOjE3Mjc4ODQ4MTUsImp0aSI6ImYwN2M3YWJjNWRiYTRiYjVhODg1MzBmOTFjNTBmZDllIiwidXNlcl9pZCI6NCwic2NvcGUiOiJub3JtYWwifQ.Y1wRnScW2D1-rd2PtM2Wjt_EWDNFRg6SXglgneoN_QY"
						}
					}
				}
			}
		)

DOC_ERROR_CREATING_USER = openapi.Response(
			description="failed to created user in database",
			examples={
				"application/json": {
					"message": MSG_ERROR_CREATING_USER,
					"data": {
						"username": [
							"This field is required."
							]
					}
				}
			}
		)

DOC_ERROR_LOGIN_FAILED = openapi.Response(
			description="failed to login with credentials",
			examples={
				"application/json": {
					"message": MSG_ERROR_NO_ACCOUNT
				}
			}
		)

DOC_USER_LOGIN = openapi.Response(
			description=MSG_LOGIN,
			examples={
				"application/json": {
					"message": MSG_LOGIN,
					"data": {
						"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzk3MTg5MiwiaWF0IjoxNzI3ODg1NDkyLCJqdGkiOiI5ODJjNzkwYjMyMDc0NWE3YmY2ZTA5YzBkY2I2N2MwNSIsInVzZXJfaWQiOjQsInNjb3BlIjoibm9ybWFsIn0.ZDb5YSXDBhUDmNaDGjwIaL0SuwgHFk6DjVWosjBY3u8",
						"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODg2MzkyLCJpYXQiOjE3Mjc4ODU0OTIsImp0aSI6ImE2ODQzYjdkYTFhMDRlZTdhZmRiM2ZmNTcwMjYwOTJiIiwidXNlcl9pZCI6NCwic2NvcGUiOiJub3JtYWwifQ.hgISgwKd2HoJbCgJ6BbRLaGPjmGkk03I6Kpdd-F2mMA",
						"2fa_status": "off"
					}
				}
			}
		)

DOC_USER_LOGIN_2FA = openapi.Response(
			description=MSG_LOGIN_NEED_2FA,
			examples={
				"application/json": {
					"message": MSG_LOGIN_NEED_2FA,
					"data": {
						"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODg2MzkyLCJpYXQiOjE3Mjc4ODU0OTIsImp0aSI6ImE2ODQzYjdkYTFhMDRlZTdhZmRiM2ZmNTcwMjYwOTJiIiwidXNlcl9pZCI6NCwic2NvcGUiOiJub3JtYWwifQ.hgISgwKd2HoJbCgJ6BbRLaGPjmGkk03I6Kpdd-F2mMA",
						"2fa_status": "on"
					}
				}
			}
		)

DOC_ERROR_INVALID_2FA = openapi.Response(
			description="Can't validate 2fa authentication, due to missing token or 2fa disable or no 2fa device find or wrong token",
			examples={
				"application/json": {
					"message": MSG_ERROR_TOKEN_REQUIRED
				}
			}
		)

DOC_2FA_DEVIDE_VALID = openapi.Response(
			description=MSG_DEVICE_VALIDATED,
			examples={
				"application/json": {
					"message": MSG_DEVICE_VALIDATED,
					"data": {
						"2fa_status": "on"
					}
				}
			}
		)

DOC_2FA_DEVIDE_ALREADY_VALID = openapi.Response(
			description=MSG_DEVICE_ALREADY_CONFIRMED,
			examples={
				"application/json": {
					"message": MSG_DEVICE_ALREADY_CONFIRMED
				}
			}
		)

DOC_2FA_VALID = openapi.Response(
			description=MSG_LOGIN,
			examples={
				"application/json": {
					"message": MSG_LOGIN,
					"data": {
						"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzk3MTg5MiwiaWF0IjoxNzI3ODg1NDkyLCJqdGkiOiI5ODJjNzkwYjMyMDc0NWE3YmY2ZTA5YzBkY2I2N2MwNSIsInVzZXJfaWQiOjQsInNjb3BlIjoibm9ybWFsIn0.ZDb5YSXDBhUDmNaDGjwIaL0SuwgHFk6DjVWosjBY3u8",
						"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODg2MzkyLCJpYXQiOjE3Mjc4ODU0OTIsImp0aSI6ImE2ODQzYjdkYTFhMDRlZTdhZmRiM2ZmNTcwMjYwOTJiIiwidXNlcl9pZCI6NCwic2NvcGUiOiJub3JtYWwifQ.hgISgwKd2HoJbCgJ6BbRLaGPjmGkk03I6Kpdd-F2mMA",
					}
				}
			}
		)

JWT_TOKEN = openapi.Parameter('Authentication : Bearer XXX',openapi.IN_HEADER,description="jwt access token", type=openapi.IN_HEADER, required=True)

DOC_ERROR_WRONG_2FA_STATUS = openapi.Response(
			description=MSG_ERROR_WRONG_2FA_STATUS,
			examples={
				"application/json": {
					"message": MSG_ERROR_WRONG_2FA_STATUS
				}
			}
		)

DOC_DISABLE_2FA = openapi.Response(
			description=MSG_DISABLE_2FA,
			examples={
				"application/json": {
					"message": MSG_DISABLE_2FA,
					"data": {"2fa_status" : "off"}
				}
			}
		)

DOC_ENABLE_2FA = openapi.Response(
			description=MSG_ENABLE_2FA,
			examples={
				"application/json": {
					"message": MSG_ENABLE_2FA,
					"data": {"2fa_status" : "waiting",
							"code": "DFSG5DFGH4F6G5H4FG6H4F6G4H",
							"qrcode": "data:image/png;base64,fghfghfghfghfhf"}
				}
			}
		)

DOC_URL_OAUTH42 = openapi.Response(
			description=MSG_SEND_URL_OAUTH,
			examples={
				"application/json": {
					"message": MSG_SEND_URL_OAUTH,
					"data": "http://coucou"
				}
			}
		)

DOC_ERROR_LOGIN_API42 = openapi.Response(
			description=MSG_ERROR_OAUTH_LOGIN,
			examples={
				"application/json": {
					"message": MSG_ERROR_OAUTH_LOGIN
				}
			}
		)

DOC_USER_CREATED_API42 = openapi.Response(
			description=MSG_USER_OAUTH_CREATED,
			examples={
				"application/json": {
					"message": MSG_USER_OAUTH_CREATED,
					'data': {
						"user": {
							"id": 4,
							"email": "a@gmai.com",
							"phone": "+33659482658",
							"username": "coucou"
						},
						"tokens": {
							"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzk3MTIxNSwiaWF0IjoxNzI3ODg0ODE1LCJqdGkiOiJkYzQwNjJjYzM5YTY0YWFhOTg1MDNkYjRkMTJiYmNiYiIsInVzZXJfaWQiOjQsInNjb3BlIjoibm9ybWFsIn0.yvWIU2TLw681zjQje7UZ1bPEqnhFmgoJODzlbhTHwVg",
							"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODg1NzE1LCJpYXQiOjE3Mjc4ODQ4MTUsImp0aSI6ImYwN2M3YWJjNWRiYTRiYjVhODg1MzBmOTFjNTBmZDllIiwidXNlcl9pZCI6NCwic2NvcGUiOiJub3JtYWwifQ.Y1wRnScW2D1-rd2PtM2Wjt_EWDNFRg6SXglgneoN_QY"
						}
					}
				}
			}
		)

DOC_USER_CREATED_API42_WARNING = openapi.Response(
			description=MSG_USER_OAUTH_CREATED+', warning change username',
			examples={
				"application/json": {
					"message": MSG_USER_OAUTH_CREATED,
					'warning' : 'change username because already used',
					'data': {
						"user": {
							"id": 4,
							"email": "a@gmai.com",
							"phone": "+33659482658",
							"username": "coucou"
						},
						"tokens": {
							"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzk3MTIxNSwiaWF0IjoxNzI3ODg0ODE1LCJqdGkiOiJkYzQwNjJjYzM5YTY0YWFhOTg1MDNkYjRkMTJiYmNiYiIsInVzZXJfaWQiOjQsInNjb3BlIjoibm9ybWFsIn0.yvWIU2TLw681zjQje7UZ1bPEqnhFmgoJODzlbhTHwVg",
							"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODg1NzE1LCJpYXQiOjE3Mjc4ODQ4MTUsImp0aSI6ImYwN2M3YWJjNWRiYTRiYjVhODg1MzBmOTFjNTBmZDllIiwidXNlcl9pZCI6NCwic2NvcGUiOiJub3JtYWwifQ.Y1wRnScW2D1-rd2PtM2Wjt_EWDNFRg6SXglgneoN_QY"
						}
					}
				}
			}
		)

DOC_USER_LOGIN_API42 = openapi.Response(
			description=MSG_LOGIN_OAUTH,
			examples={
				"application/json": {
					"message": MSG_LOGIN_OAUTH,
					'data': {
						"tokens": {
							"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzk3MTIxNSwiaWF0IjoxNzI3ODg0ODE1LCJqdGkiOiJkYzQwNjJjYzM5YTY0YWFhOTg1MDNkYjRkMTJiYmNiYiIsInVzZXJfaWQiOjQsInNjb3BlIjoibm9ybWFsIn0.yvWIU2TLw681zjQje7UZ1bPEqnhFmgoJODzlbhTHwVg",
							"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODg1NzE1LCJpYXQiOjE3Mjc4ODQ4MTUsImp0aSI6ImYwN2M3YWJjNWRiYTRiYjVhODg1MzBmOTFjNTBmZDllIiwidXNlcl9pZCI6NCwic2NvcGUiOiJub3JtYWwifQ.Y1wRnScW2D1-rd2PtM2Wjt_EWDNFRg6SXglgneoN_QY"
						}
					}
				}
			}
		)

DOC_UPDATE_PASSWORD = openapi.Response(
			description=MSG_PASSWORD_UPDATE,
			examples={
				"application/json": {
					"message": MSG_PASSWORD_UPDATE,
				}
			}
		)

DOC_IMPOSSIBLE_UPDATE_PASSWORD = openapi.Response(
			description=MSG_ERROR_UPDATE_PASSWORD_OAUTH,
			examples={
				"application/json": {
					"message": MSG_ERROR_UPDATE_PASSWORD_OAUTH,
				}
			}
		)

DOC_ERROR_UPDATE_PASSWORD = openapi.Response(
			description=MSG_ERROR_UPDATE_PASSWORD,
			examples={
				"application/json": {
					"message": MSG_ERROR_UPDATE_PASSWORD,
					"data": {
						"password": [
							"Password fields didn't match"
						]
					}
				}
			}
		)

DOC_UPDATE_INFO = openapi.Response(
			description=MSG_INFO_USER_UPDATE,
			examples={
				"application/json": {
					"message": MSG_INFO_USER_UPDATE,
					"data": {
						"username": "coucou",
						"email": "fghf@fdg.ds",
						"phone": "+33326597845",
						"pin": "0004",
						"refresh": "dfggggggggggggggggggggggg",
						"access": "dfggggggggggggggggggggggg"
					}
				}
			}
		)

DOC_ERROR_UPDATE_INFO = openapi.Response(
			description=MSG_ERROR_UPDATE_USER_INFO,
			examples={
				"application/json": {
					"message": MSG_ERROR_UPDATE_USER_INFO,
					"data": {
						"username": [
							"This field is required."
						],
						"email": [
							"Enter a valid email address."
						],
						"phone": [
							"The phone number entered is not valid."
						]
					}
				}
			}
		)

DOC_ERROR_UPDATE_INFO_BIS = openapi.Response(
			description=MSG_ERROR_UPDATE_USER_INFO,
			examples={
				"application/json": {
					"message": MSG_ERROR_UPDATE_USER_INFO,
				}
			}
		)

DOC_ERROR_INVALID_TOKEN = openapi.Response(
			description=MSG_ERROR_INVALID_REFRESH_TOKEN,
			examples={
				"application/json": {
					"message": MSG_ERROR_INVALID_REFRESH_TOKEN,
				}
			}
		)

DOC_ERROR_NEED_REFRESH_TOKEN = openapi.Response(
			description=MSG_ERROR_REFRESH_REQUIRED,
			examples={
				"application/json": {
					"message": MSG_ERROR_REFRESH_REQUIRED,
				}
			}
		)

DOC_LOGOUT = openapi.Response(
			description=MSG_LOGOUT,
			examples={
				"application/json": {
					"message": MSG_LOGOUT,
				}
			}
		)

DOC_TOKEN_REFRESH = openapi.Response(
			description=MSG_TOKEN_REFRESH,
			examples={
				"application/json": {
					"message": MSG_TOKEN_REFRESH,
					"data": {
						"tokens": {
							"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzk3MTIxNSwiaWF0IjoxNzI3ODg0ODE1LCJqdGkiOiJkYzQwNjJjYzM5YTY0YWFhOTg1MDNkYjRkMTJiYmNiYiIsInVzZXJfaWQiOjQsInNjb3BlIjoibm9ybWFsIn0.yvWIU2TLw681zjQje7UZ1bPEqnhFmgoJODzlbhTHwVg",
							"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3ODg1NzE1LCJpYXQiOjE3Mjc4ODQ4MTUsImp0aSI6ImYwN2M3YWJjNWRiYTRiYjVhODg1MzBmOTFjNTBmZDllIiwidXNlcl9pZCI6NCwic2NvcGUiOiJub3JtYWwifQ.Y1wRnScW2D1-rd2PtM2Wjt_EWDNFRg6SXglgneoN_QY"
						}
					}
				}
			}
		)

DOC_2FA_STATUS = openapi.Response(
			description=MSG_2FA_STATUS + ", the status can be 'on' or 'off",
			examples={
				"application/json": {
					"message": MSG_2FA_STATUS,
					"data": {
						"2fa_status": "on",
					}
				}
			}
		)

DOC_IMAGE_URL = openapi.Response(
			description=MSG_PICTURE_URL,
			examples={
				"application/json": {
					"message": MSG_PICTURE_URL,
					"data": "https://localhost:8443/api/users/media/fffff"
				}
			}
		)

DOC_ERROR_NO_IMAGE = openapi.Response(
			description=MSG_ERROR_NO_IMAGE,
			examples={
				"application/json": {
					"message": MSG_ERROR_NO_IMAGE
				}
			}
		)

DOC_IMAGE_UPDATED = openapi.Response(
			description=MSG_UPDATE_PICTURE,
			examples={
				"application/json": {
					"message": MSG_UPDATE_PICTURE,
					"data": {
						"profile_picture": "https://localhost:8443/api/users/media/profile_pictures/8_412bca24fc144e4bba91078e2dd18e23.png"
					}
				}
			}
		)

DOC_ERROR_UPADTE_IMAGE = openapi.Response(
			description=MSG_ERROR_UPDATING_IMAGE,
			examples={
				"application/json": {
					"message": MSG_ERROR_UPDATING_IMAGE,
					"data": {
						"profile_picture": [
							"Upload a valid image. The file you uploaded was either not an image or a corrupted image."
						]
					}
				}
			}
		)

