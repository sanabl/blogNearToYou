from django.urls import path

from blog.views import UserController
from blog.views import BlogController
urlpatterns = [
    path('register/', UserController.as_view()),
    path('', BlogController.as_view(), name='blog'),
    path('123', UserController.as_view(), name='search'),
]