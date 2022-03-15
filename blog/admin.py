from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from blog.inlines import UserProfileInline
from blog.models import User


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)


admin.site.register(User, UserAdmin)
