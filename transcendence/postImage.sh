#!/bin/bash

# Define the URL and the image path
URL="http://localhost:8000/users/signup/"
IMAGE_PATH="Zaius.png"

# Use curl to send a POST request with multipart/form-data
curl -X POST "$URL" \
  -H "Content-Type: multipart/form-data" \
  -F "id=35" \
  -F "password=p@ssworD35" \
  -F "password1=p@ssworD35" \
  -F "username=35salut" \
  -F "email=35@gmail.com" \
  -F "phone=35" \
  -F "profile_picture=@$IMAGE_PATH"