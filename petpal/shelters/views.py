# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from accounts.models import PetPalUser, Shelter
from .serializers import ShelterSerializer


from django.http import JsonResponse

# Create your views here.

'''
LIST All Shelters
ENDPOINT: /api/shelters
METHOD: GET
PERMISSION:
'''
@api_view(['GET'])
def shelters_list_view(request):
    # Check that this is a logged-in user
    if request.user.is_authenticated:
        shelters = Shelter.objects.all()
        serializer = ShelterSerializer(shelters, many=True)
        return Response({'msg': 'List of shelters', 'data': serializer.data}, status=status.HTTP_200_OK)

    return Response({'error': 'User is not logged in'}, status=status.HTTP_403_FORBIDDEN)

'''
VIEW / EDIT / DELETE A shelter
ENDPOINT: /api/shelters/<str:account_id>/
METHOD: GET, PUT, DELETE
PERMISSION:
SUCCESS:
'''
@api_view(['GET', 'PUT'])
def shelter_detail_view(request, account_id):

    # Check that the shelter exists
    try:
        shelter = Shelter.objects.get(id=account_id)
    except Shelter.DoesNotExist:
        return Response({'error': 'Shelter does not exist'}, status=status.HTTP_404_NOT_FOUND)

    # METHODS
    if request.method == 'GET':
        # Check that this is a logged-in user
        if request.user.is_authenticated:
            # Give details of the shelter
            serializer = ShelterSerializer(shelter, many=False)
            return Response({'msg': 'Shelter Detail', 'data': serializer.data}, status=status.HTTP_200_OK)

        else:
            return Response({'error': 'User is not logged in'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        # Check that the request is from the shelter themselves
        if request.user == shelter:
            shelter.email = request.data.get('email', shelter.email)
            shelter.address = request.data.get('address', shelter.address)
            shelter.city = request.data.get('city', shelter.city)
            shelter.province = request.data.get('province', shelter.province)
            shelter.postal_code = request.data.get('postal_code', shelter.postal_code)
            shelter.phone = request.data.get('phone', shelter.phone)
            shelter.avatar = request.data.get('avatar', shelter.avatar)
            shelter.description = request.data.get('description', shelter.description)
            shelter.password = request.data.get('password', shelter.password)  # not sure if we should have password?

            serialized = ShelterSerializer(shelter, many=False)

            return Response({'msg': 'edit shelter', 'data': serialized.data}, status=status.HTTP_200_OK)

        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)


