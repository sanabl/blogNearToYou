from dataclasses import dataclass

from django.db.models import Q

from blog.constant import PostStatus
from blog.models import Post
from blog.utils import get_first_image_url_in_html


@dataclass
class PostComponent:
    def get_draft_post(self, user_id):
        draft_post = Post.objects.filter(user=user_id, status=PostStatus.Draft).first()
        if draft_post:
            return draft_post
        return Post.objects.create(user_id=user_id)

    def get_published_post(self, slug):
        return Post.objects.filter(slug=slug, status=PostStatus.Published).first()

    def get_latest_post(self, number_of_posts):
        posts = Post.objects.filter(status=PostStatus.Published).all().order_by('-created')[:number_of_posts]
        return posts
    def get_posts(self):
        return Post.objects.filter(status=PostStatus.Published).order_by('-created').all()

    def get_post(self, slug):
        pass

    def delete_post(self, post):
        post.comments.filter(~Q(parent=None)).all().delete()
        post.comments.all().delete()
        post.delete()