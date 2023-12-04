from rest_framework import serializers
from accounts.models import Seeker
from petlistings.models import PetListing


class SeekerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seeker
        fields = ['email', 'address', 'city', 'province', 'postal_code', 'phone', 'avatar',
                  'is_notif_comment', 'is_notif_status', 'is_notif_petlisting', 'first_name', 'last_name']


class FavPetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = ['id', 'name', 'category', 'breed', 'age', 'gender', 'size', 'status', 'med_history',
                  'behaviour', 'special_needs', 'description']

