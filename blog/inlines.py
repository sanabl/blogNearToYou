from django.contrib import admin

from blog.models import UserProfile


class UserProfileInline (admin.TabularInline):
    model = UserProfile
    can_delete = False
