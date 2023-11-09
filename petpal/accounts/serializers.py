from rest_framework import serializers
from .models import PetPalUser

class SignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    account_type = serializers.CharField(write_only=True)

    class Meta:
        model = PetPalUser
        fields = ['id','first_name', 'last_name', 'email', 'password','confirm_password','account_type' ]

    def validate(self, data):
        # check password mismatch
        confirm_password = data.pop('confirm_password')
        if data['password'] != confirm_password:
            raise serializers.ValidationError({'password':'Passwords did not match'})
        
        # assign role
        account_type = data.pop('account_type')
        role = PetPalUser.Role.SHELTER if account_type == 'shelter' else PetPalUser.Role.SEEKER
        data['role'] = role

        return data
    

    def create(self, validated_data):
        return PetPalUser.objects.create_user(**validated_data)
