from rest_framework import serializers

from blog import models


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Photo
        fields = ('id', 'file')


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Post
        fields = ('title', 'body', 'lastPosition', 'status')
