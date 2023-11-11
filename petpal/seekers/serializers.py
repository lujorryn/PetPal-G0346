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
        fields = ['id', 'name', 'category', 'breed', 'age', 'gender', 'size', 'status', 'med_history',
                  'behaviour', 'special_needs', 'description']


# Function to help with the parameter
def serialize_fav_pets(fav_pets):
    # Check if fav_pets is a list (has many objects) or a single object
    if isinstance(fav_pets, list):
        serializer = FavPetSerializer(fav_pets, many=True)
    else:
        serializer = FavPetSerializer(fav_pets, many=False)

    return serializer.data
