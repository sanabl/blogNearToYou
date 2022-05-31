from django.db import models


class PostStatus(models.TextChoices):
    Draft = 'D'
    Published = 'P'
