from django.contrib import auth
from django.contrib.auth import login
from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import DetailView
from rest_framework import viewsets
from rest_framework.decorators import api_view

from blog import models
from blog.base_view import AuthenticatedViewSet
from blog.component import PostComponent
from blog.constant import PostStatus
from blog.forms import UserForm, PostForm
from blog.models import Photo, User, Post
from blog.serializer import PhotoSerializer, PostSerializer
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from pathlib import Path


def get_base_context(request):
    return {'user': request.user,
            'latestpost_list': PostComponent().get_latest_post(3)
            }


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


class BlogController(View):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.post_component = PostComponent()

    def get(self, request, *args, **kwargs):
        template_name = 'index.html'
        paginator = Paginator(self.post_component.get_posts(), 3)
        context = get_base_context(request)
        page_number = kwargs.get('page', 1)
        blogs = paginator.get_page(page_number)
        context.update({
            'blogs': blogs
        })
        return render(request, context=context, template_name=template_name)


class PostDetails(DetailView):
    model = Post
    template_name = 'Post/post_details.html'

    def get(self, request, *args, **kwargs):
        self.request = request
        return super(PostDetails, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(get_base_context(self.request))
        return context


class PostController(View):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.post_component = PostComponent()

    def get(self, request, *args, **kwargs):
        current_user = User.objects.filter(email='sanabeltahon98@gmail.com').first()
        if request.user:
            login(request, current_user)

        template = 'POST/post.html'
        slug = kwargs.get('slug')
        if slug:
            post = self.post_component.get_published_post(slug)
        else:
            post = self.post_component.get_draft_post(current_user.id)
        context = get_base_context(request)
        context.update({
            'title': post.title,
            'body': post.body,
            'lastPosition': post.lastPosition,
            'status': post.status,
        })
        return render(request, template, context)


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = models.Photo.objects.all()
    serializer_class = PhotoSerializer
    parser_classes = [MultiPartParser]

    def retrieve(self, request, *args, **kwargs):
        raise NotImplementedError()

    def update(self, request, *args, **kwargs):
        raise NotImplementedError()

    def create(self, request, *args, **kwargs):
        data = {'file': request.data['files[]']}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(self._build_response(serializer.data), status=status.HTTP_201_CREATED, headers=headers)

    def _build_response(self, data):
        return {
            "files":
                [
                    {
                        "url": data['file']
                    }
                ]
        }


@api_view(['POST'])
def remove_image(request):
    file_path = request.data.get('file')
    name = Path(file_path).name
    image = Photo.objects.filter(file=name).first()
    if image:
        image.delete()
    return Response(status.HTTP_204_NO_CONTENT)


class PostsViewSet(AuthenticatedViewSet):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.post_component = PostComponent()

    queryset = models.Post.objects.all()
    serializer_class = PostSerializer

    def create(self, request, *args, **kwargs):
        current_user = request.user
        serializer = PostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_post = serializer.validated_data
        post = self.post_component.get_draft_post(current_user.id)
        serializer.update(post, new_post)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        current_user = request.user
        slug = kwargs.get('pk')
        post = self.post_component.get_published_post(slug)
        serializer = PostSerializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=current_user)
        return Response(status=status.HTTP_204_NO_CONTENT)

