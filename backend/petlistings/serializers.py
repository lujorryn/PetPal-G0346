from rest_framework import serializers
from .models import PetListing, PetListingImage

class PetListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListingImage
        fields = "__all__"

class PetListingSerializer(serializers.ModelSerializer):    
    class Meta:
        model = PetListing
        fields = ['name', 'category', 'breed', 'age', 'gender', 'size', 'status', 'med_history', 'behaviour', 'special_needs', 'description']
