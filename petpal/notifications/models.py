from django.db import models

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# from django.contrib.auth.models import User
from django.conf import settings
User = settings.AUTH_USER_MODEL

# Create your models here.
class Notification(models.Model):
    subject = models.TextField()
    body = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    recipients = models.ManyToManyField(User, related_name="notifications")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE) # Can also be set null depending on interpretation
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()
