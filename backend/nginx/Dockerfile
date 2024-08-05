FROM nginx:1.26.1

RUN apt -y update; apt -y upgrade;\
	apt -y install bison build-essential ca-certificates curl dh-autoreconf doxygen \
		flex gawk git iputils-ping libcurl4-gnutls-dev libexpat1-dev libgeoip-dev liblmdb-dev \
		libpcre3-dev libssl-dev libtool libxml2 libxml2-dev libyajl-dev locales \
		pkg-config wget zlib1g-dev libgd-dev;

WORKDIR /opt

RUN git clone https://github.com/SpiderLabs/ModSecurity

WORKDIR /opt/ModSecurity

RUN git submodule init;\
		git submodule update;\
		./build.sh;\
		./configure;\
		make;\
		make install

WORKDIR /opt

RUN git clone https://github.com/SpiderLabs/ModSecurity-nginx

RUN wget http://nginx.org/download/nginx-1.26.1.tar.gz;\
		tar -xzvf nginx-1.26.1.tar.gz;\
	cd /opt/nginx-1.26.1; ./configure --prefix=/etc/nginx --sbin-path=/usr/sbin/nginx --modules-path=/usr/lib/nginx/modules --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --http-client-body-temp-path=/var/cache/nginx/client_temp --http-proxy-temp-path=/var/cache/nginx/proxy_temp --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp --http-scgi-temp-path=/var/cache/nginx/scgi_temp --user=nginx --group=nginx --with-compat --with-file-aio --with-threads --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module --with-http_v3_module --with-mail --with-mail_ssl_module --with-stream --with-stream_realip_module --with-stream_ssl_module --with-stream_ssl_preread_module --with-cc-opt='-g -O2 -ffile-prefix-map=/data/builder/debuild/nginx-1.26.1/debian/debuild-base/nginx-1.26.1=. -fstack-protector-strong -Wformat -Werror=format-security -Wp,-D_FORTIFY_SOURCE=2 -fPIC' --with-ld-opt='-Wl,-z,relro -Wl,-z,now -Wl,--as-needed -pie' --add-dynamic-module=../ModSecurity-nginx;\
	make modules;\
	cd /opt; rm nginx-1.26.1.tar.gz


RUN mkdir -p /etc/nginx/modules; cp /opt/nginx-1.26.1/objs/ngx_http_modsecurity_module.so /etc/nginx/modules

RUN git clone https://github.com/coreruleset/coreruleset /usr/local/modsecurity-crs;\
	mv /usr/local/modsecurity-crs/crs-setup.conf.example /usr/local/modsecurity-crs/crs-setup.conf;\
	mv /usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example \
		/usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf

RUN mkdir -p /etc/nginx/modsec;\
	cp /opt/ModSecurity/unicode.mapping /etc/nginx/modsec/;\
	mv /opt/ModSecurity/modsecurity.conf-recommended /opt/ModSecurity/modsecurity.conf;

COPY ./modsecurity/main.conf		/etc/nginx/modsec/main.conf
COPY ./modsecurity/modsecurity.conf	/etc/nginx/modsec/modsecurity.conf

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx.key -out /etc/ssl/certs/nginx.crt -subj "/C=FR/ST=ile-de-france/L=Paris/CN=42School";\
	openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096

