from django.db import models

from django.contrib.contenttypes.fields import GenericRelation

from notifications.models import Notification
from django.contrib.contenttypes.models import ContentType
from accounts.models import PetPalUser
# from django.contrib.auth.models import User
from django.conf import settings
User = settings.AUTH_USER_MODEL

# Create your models here.
class PetListing(models.Model):
    class Meta:
        verbose_name = "pet listing"
    
    CATEGORIES = (('D', 'Dog'),( 'C', 'Cat'), ('O', 'Other'))
    GENDER = (('M', 'Male'), ('F', 'Female'), ('X', 'Unknown'))
    SIZE = (('L', 'Large'), ('M', 'Mid'), ('S', 'Small'))
    STATUS = (('AV', 'Available'), ('AD', 'Adopted'), ('PE', 'Pending'), ('WI', 'Withdrawn'))
    
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=1, choices=CATEGORIES)
    breed = models.CharField(max_length=255, blank=True)
    age = models.PositiveIntegerField(blank=True) # blank -> age unknown, can remove if implementation too complicated
    gender = models.CharField(max_length=1, choices=GENDER)
    size = models.CharField(max_length=1, choices=SIZE)
    status = models.CharField(max_length=2, choices=STATUS, default='AV')
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    med_history = models.TextField(blank=True, null=True)
    behaviour = models.TextField(blank=True, null=True)
    special_needs = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='petlistings')
    notification = GenericRelation(Notification)
    favorited_by = models.ManyToManyField(User, related_name='favorited_pets')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Create notification
        subject = f'A new Pet listing has been created by {self.owner.email}!'
        body = f'{self.name} is now available for adoption.'
        notification = Notification(subject=subject, body=body, content_type=ContentType.objects.get_for_model(self), object_id=self.pk, content_object=self)
        notification.save()
        users = PetPalUser.objects.filter(role=PetPalUser.Role.SEEKER, is_notif_petlisting=True)
        notification.recipients.add(*users)
        notification.save()

class PetListingImage(models.Model):
    class Meta:
        verbose_name = 'pet listing image'

    image = models.ImageField(upload_to="pet-images/")
    petlisting = models.ForeignKey(PetListing, on_delete=models.CASCADE, related_name='images')