from rest_framework import serializers
from accounts.models import Shelter
# from petlistings.models import PetListing


class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = ['email', 'address', 'city', 'province', 'postal_code', 'phone', 'avatar', 'description']


# class FavPetSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PetListing
#         fields = ['name']  # Maybe retrieve id/primary key instead of name?
