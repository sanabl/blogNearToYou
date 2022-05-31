from django.urls import path, include
from rest_framework import routers
from blog.views import UserController, PostController, PostDetails, BlogController, PhotoViewSet, remove_image, PostsViewSet, CommentViewSet
from django.conf.urls.static import static
from django.conf import settings

router = routers.DefaultRouter()
router.register(r'photos', PhotoViewSet)
router.register(r'posts', PostsViewSet)
router.register(r'comment', CommentViewSet)
urlpatterns = [
    path('register/', UserController.as_view()),
    path('', BlogController.as_view(), name='blog'),
    path('<int:page>', BlogController.as_view(), name='post-page'),
    path('123', UserController.as_view(), name='search'),
    path('post/', PostController.as_view(), name='post'),
    path('post/<str:slug>', PostController.as_view(), name='post-edit'),
    path('post/detials/<str:slug>', PostDetails.as_view(), name='post-details'),
    # path('post/<slug:slug>', PostController.as_view(), name='post-details'),
    # path('post/<slug:slug>', PostController.as_view(), name='post'),
    path('api/v1/image', remove_image),
    path('api/v1/', include(router.urls)),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


