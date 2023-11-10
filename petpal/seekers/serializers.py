from rest_framework import serializers
from accounts.models import Seeker
from petlistings.models import PetListing


class SeekerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seeker
        fields = ['email', 'address', 'city', 'province', 'postal_code', 'phone', 'avatar']


class FavPetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = ['name']  # Maybe retrieve id/primary key instead of name?
