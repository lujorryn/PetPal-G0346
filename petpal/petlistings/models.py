from django.db import models

from django.contrib.contenttypes.fields import GenericRelation

from notifications.models import Notification
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
    status = models.CharField(max_length=2, choices=STATUS)
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    med_history = models.TextField(blank=True)
    behaviour = models.TextField(blank=True)
    special_needs = models.TextField(blank=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='petlistings')
    notification = GenericRelation(Notification)
    favorited_by = models.ManyToManyField(User, related_name='favorited_pets')

class PetListingImage(models.Model):
    class Meta:
        verbose_name = 'pet listing image'

    image = models.ImageField(upload_to="pet-images/")
    petlisting = models.ForeignKey(PetListing, on_delete=models.CASCADE, related_name='images')