CDM-DOCKER= docker compose
DOCKER= docker-compose.yml

SRCS_DIR = ./backend/

SRCS_MANDATORY= core

SRCS_LIST=	friends \
			history \
			users

SRCS = ${addprefix ${SRCS_DIR}, ${addsuffix /${DOCKER}, ${SRCS_LIST}}}

all:
	@${CDM-DOCKER} -f ${SRCS_DIR}${SRCS_MANDATORY}/${DOCKER} up -d;
	@for src in ${SRCS}; do\
		${CDM-DOCKER} -f $$src up -d;\
	done

clean:
	@for src in ${SRCS}; do\
		${CDM-DOCKER} -f $$src down;\
	done
	@${CDM-DOCKER} -f ${SRCS_DIR}${SRCS_MANDATORY}/${DOCKER} down;

fclean: clean
	docker system prune -fa && \
	docker volume prune -af && \
	docker system df