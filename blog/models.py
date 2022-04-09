
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)


class UserProfile(models.Model):
    nickname = models.CharField(max_length=30)
    User = models.OneToOneField(User, on_delete=models.CASCADE)


class Post(models.Model):
    title = models.CharField(max_length=30)
    body = models.TextField()
    published = models.BooleanField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)