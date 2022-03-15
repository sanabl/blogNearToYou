from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class UserProfile(models.Model):
    nickname = models.CharField(max_length=30)
    User = models.OneToOneField(User, on_delete=models.CASCADE)
