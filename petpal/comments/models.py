from django.db import models

from django.contrib.contenttypes.fields import GenericRelation

from applications.models import Application
from notifications.models import Notification
from django.contrib.contenttypes.models import ContentType
# from django.contrib.auth.models import User
from django.conf import settings
User = settings.AUTH_USER_MODEL

class Comment(models.Model):
    content = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)
    rating = models.PositiveIntegerField(blank=True, null=True)
    is_author_seeker = models.BooleanField() # determines the author and recipient
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seeker_comments')
    shelter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shelter_comments')
    is_review = models.BooleanField() # True: shelter review, False: application comment
    application = models.ForeignKey(Application, on_delete=models.CASCADE, blank=True)
    notification = GenericRelation(Notification, related_query_name='comments')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Create notification
        subject = ''
        body = ''
        if self.is_review:
            if self.is_author_seeker:
                subject = 'You have received a review!'
                body = f'You have received a review from {self.seeker.email}.'
            else:
                subject = 'You have received a review!'
                body = f'You have received a review from {self.shelter.email}.'
        else:
            if self.is_author_seeker:
                subject = 'You have received a comment!'
                body = f'You have received a comment from {self.seeker.email} for their application on {self.application.petlisting.name}.'
            else:
                subject = 'You have received a comment!'
                body = f'You have received a comment from {self.shelter.email} for your application on {self.application.petlisting.name}.'
        notification = Notification(subject=subject, body=body, content_type=ContentType.objects.get_for_model(self), object_id=self.pk, content_object=self)
        if self.is_review:
            notification.recipients.add(self.shelter)
        else:
            if self.is_author_seeker:
                notification.recipients.add(self.shelter)
            else:
                notification.recipients.add(self.seeker)
        notification.save()