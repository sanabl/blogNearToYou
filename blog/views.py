from django.contrib import auth
from django.shortcuts import render, redirect
from django.views import View

from blog.forms import UserProfileForm, UserForm
from blog.models import User


class UserController(View):
    def get(self, request, *args, **kwargs):
        template = 'user/register.html'
        user_form = UserForm()
        context = {
            'user_form': user_form,
        }
        return render(request, template, context)

    def post(self, request, *args, **kwargs):
        template = 'user/register.html'
        user_form = UserForm(request.POST)
        context = {
                'user_form': user_form,
            }
        if user_form.is_valid():
            user = user_form.save()
            user = auth.authenticate(username=user, password=user_form.cleaned_data.get('password1'))
            auth.login(request, user)
            return redirect('blog')
        else:
            return render(request, template, context)

