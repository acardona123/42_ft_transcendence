from django.db.backends.postgresql import base
from vault.hvac_vault import create_client, create_cred

class DatabaseWrapper(base.DatabaseWrapper):
	def get_connection_params(self):
		client = create_client()
		cred = create_cred(client, self.settings_dict['HOST'])
		data = cred.get("data")
		user = data.get('username')
		password = data.get('password')
		self.settings_dict['USER'] = user
		self.settings_dict['PASSWORD'] = password
		conn_params = super().get_connection_params()
		return conn_params