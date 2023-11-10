from django.db import models

from django.contrib.contenttypes.fields import GenericRelation

from petlistings.models import PetListing
from notifications.models import Notification
# from django.contrib.auth.models import User
from django.conf import settings
User = settings.AUTH_USER_MODEL

# Create your models here.
class Application(models.Model):
    CONTACT_PREF = (('P', 'Phone Call'), ('T', 'Text'), ('E', 'Email'))
    EXPERIENCE = (('EX', 'Experienced'), ('IN', 'Intermediate'), ('NE', 'No Experience'))
    RESIDENCE_TYPE = (('C', 'Condo'), ('A', 'Apartment'), ('H', 'House'))
    STATUS = (('P', 'Pending'), ('A', 'Approved'), ('D', 'Declined'), ('W', 'Withdrawn'))
    
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=255)
    contact_pref = models.CharField(max_length=1, choices=CONTACT_PREF)
    pet_number = models.IntegerField()
    has_children = models.BooleanField()
    experience = models.CharField(max_length=2, choices=EXPERIENCE)
    residence_type = models.CharField(max_length=1, choices=RESIDENCE_TYPE)
    status = models.CharField(max_length=1, choices=STATUS)
    # not included in form-data
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="seeker_applications")
    shelter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shelter_applications")
    petlisting = models.ForeignKey(PetListing, on_delete=models.CASCADE, related_name="applications")
    notification = GenericRelation(Notification)