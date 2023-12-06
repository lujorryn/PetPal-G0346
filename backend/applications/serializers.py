from rest_framework import serializers

from .models import Application
from petlistings.serializers import PetListingSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    petlisting = PetListingSerializer()
    class Meta:
        model = Application
        fields = '__all__'
    