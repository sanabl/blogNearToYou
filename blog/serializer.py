from rest_framework import serializers

from blog import models


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserProfile
        fields = ('nickname',)


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    class Meta:
        model = models.User
        fields = ('id', 'first_name', 'last_name', 'profile')


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Photo
        fields = ('id', 'file')


class PostSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(read_only=True)
    class Meta:
        model = models.Post
        fields = ('slug', 'title', 'body', 'lastPosition', 'status')


class SubCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comment
        fields = ('text',)


class CommentSerializer(serializers.ModelSerializer):
    children = SubCommentSerializer(read_only=True, many=True)
    class Meta:
        model = models.Comment
        fields = ('id', 'user', 'post', 'children', 'parent', 'updated', 'text')


    def to_representation(self, instance):
        res = super().to_representation(instance)
        if instance.user:
            res['user'] = UserSerializer(instance.user).data
        return res