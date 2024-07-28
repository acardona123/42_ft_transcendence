from django.shortcuts import render

# Create your views here.
def tuto_shooter_index(request):
    return render(request, "tuto_shooter/index.html")