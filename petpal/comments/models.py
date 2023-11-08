from django.db import models

from django.contrib.contenttypes.fields import GenericRelation

from applications.models import Application
from notifications.models import Notification
# from django.contrib.auth.models import User
from django.conf import settings
User = settings.AUTH_USER_MODEL

class Comment(models.Model):
    content = models.TextField()
    created_time = models.DateField(auto_now_add=True)
    rating = models.PositiveIntegerField(blank=True)
    is_author_seeker = models.BooleanField() # determines the author and recipient
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seeker_comments')
    shelter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shelter_comments')
    is_review = models.BooleanField() # True: shelter review, False: application comment
    application = models.ForeignKey(Application, on_delete=models.CASCADE, blank=True)
    notification = GenericRelation(Notification)
