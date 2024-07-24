from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.
def pong_index(request):
    return render(request, "pong/index.html")