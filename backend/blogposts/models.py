from django.db import models

# from django.contrib.auth.models import User
from django.conf import settings
User = settings.AUTH_USER_MODEL

# Create your models here.
class BlogPost(models.Model):
    class Meta:
        verbose_name = 'Blog Post'

    title = models.TextField()
    content = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to="blog-images/", blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_post')

