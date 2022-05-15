from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext as _
from django_extensions.db.fields import AutoSlugField

from blog.constant import PostStatus
from blog.utils import rand_slug, get_first_image_url_in_html


class MBaseModel(models.Model):
    created = models.DateTimeField(auto_now_add=True, editable=False, null=True)
    updated = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        abstract = True


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)


class UserProfile(MBaseModel):
    nickname = models.CharField(max_length=30)
    User = models.OneToOneField(User, on_delete=models.CASCADE)


class Post(MBaseModel):
    title = models.CharField(max_length=60)
    body = models.TextField()
    lastPosition = models.JSONField(default={})
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=1, choices=PostStatus.choices, default=PostStatus.Draft)
    slug = models.SlugField(blank=False, null=False, unique=True,allow_unicode=True)

    def __unicode__(self):
        return u'%s'%(self.body)

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        from bs4 import BeautifulSoup
        _slug = BeautifulSoup(self.title).text
        self.slug = slugify(_slug, allow_unicode=True)+rand_slug()
        super().save(force_insert, force_update, using, update_fields)

    @property
    def img_url(self):
        return get_first_image_url_in_html(self.body)

class Photo(MBaseModel):
    file = models.ImageField()

    def __str__(self):
        return self.file.name
