from django.shortcuts import render

# Create your views here.
def flappy_fish_index(request):
    return render(request, "flappy_fish/index.html")