from django.http import JsonResponse
from django.shortcuts import render


# Create your views here.

def home(request):
    """
    首页
    """
    return render(request, "index.html")


def hello_world(request):
    host = request.get_host()
    path = request.get_full_path()
    return JsonResponse({"result": True, "data": "hello world", "path": path, "host": host})
