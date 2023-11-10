# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from accounts.models import Seeker, PetPalUser
from .serializers import SeekerSerializer, FavPetSerializer
from applications.models import Application
from petlistings.models import PetListing

from django.http import JsonResponse

# Create your views here.

'''
LIST All Seekers (FORBIDDEN)
ENDPOINT: /api/seekers
METHOD: GET
PERMISSION:
'''


@api_view(['GET'])
def seekers_list_view(request):
    return Response({'msg': 'Viewing all seekers is forbidden'}, status=status.HTTP_403_FORBIDDEN)


'''
VIEW / EDIT / DELETE A Seeker
ENDPOINT: /api/seekers/<str:account_id>/
METHOD: GET, PUT, DELETE
PERMISSION:
SUCCESS:
'''


@api_view(['GET', 'PUT'])
def seeker_detail_view(request, account_id):
    # Check that the seeker with account_id exists
    try:
        seeker = Seeker.objects.get(id=account_id)
    except Seeker.DoesNotExist:
        return Response({'msg': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Check that the request is from the user themselves or a shelter.
        if request.user == seeker or request.user.role == PetPalUser.Role.SHELTER:
            # If the request is from a shelter, check it has an application with the seeker
            if request.user.role == PetPalUser.Role.SHELTER:
                try:
                    Application.objects.get(seeker=account_id, shelter=request.user)
                except Application.DoesNotExist:
                    return Response({'msg': 'You are not allowed to see this profile'},
                                    status=status.HTTP_403_FORBIDDEN)

            # Retrieves the following data: 'email', 'address', 'city', 'province', 'postal_code', 'phone'.
            serializer = SeekerSerializer(seeker, many=False)

            # Retrieve the favorite pets name
            fav_pets = PetListing.objects.get(favorited_by=seeker)
            fav_pet_serializer = FavPetSerializer(fav_pets, many=True)

            return Response({
                'msg': 'Seeker details',
                'user_data': serializer.data,
                'fav_pets': fav_pet_serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'msg': 'You are not allowed to see this profile'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        # Check that the request is from the user themselves
        if request.user == seeker:
            # Payloads: name(?), email, location, phone, avatar, password, notification, preference
            seeker.email = request.data.get('email', seeker.email)
            seeker.address = request.data.get('address', seeker.address)
            seeker.city = request.data.get('city',seeker.city)
            seeker.province = request.data.get('province', seeker.province)
            seeker.postal_code = request.data.get('postal_code', seeker.postal_code)
            seeker.phone = request.data.get('phone', seeker.phone)
            seeker.avatar = request.data.get('avatar', seeker.avatar)
            seeker.password = request.data.get('password', seeker.password)  # not sure if we should have password?

            # TODO: Update notifications/preferences

            return Response()

        return Response({'msg': 'You are not allowed to edit this profile'}, status=status.HTTP_403_FORBIDDEN)