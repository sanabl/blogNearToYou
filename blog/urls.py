from django.urls import path

from blog.views import UserController

urlpatterns = [
    path('register/', UserController.as_view()),
    path('', UserController.as_view(), name='blog'),
    path('', UserController.as_view(), name='search'),
]