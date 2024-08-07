FROM python:3

#python ouput is send directly to the terminal and not buffer
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip install python-dotenv
RUN pip install -r requirements.txt

COPY . /usr/src/app/
RUN python manage.py migrate

