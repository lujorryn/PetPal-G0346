from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['title', 'content', 'image']

class BlogPostUpdateSerializer(serializers.ModelSerializer):
    title = serializers.CharField(style={'base_template': 'textarea.html'}, required=False)
    content = serializers.CharField(style={'base_template': 'textarea.html'}, required=False)
    class Meta:
        model = BlogPost
        fields = ['title', 'content', 'image']
        extra_kwargs = {"title": {"required": False, "allow_null": True}, "content": {"required": False, "allow_null": True}}