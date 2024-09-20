from django.shortcuts import render

def home_view(request):
	print('testtttttttttttttttttt')
	return render(request, 'home.html')