# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from accounts.models import Seeker, PetPalUser
from .serializers import SeekerSerializer, FavPetSerializer
from applications.models import Application
from petlistings.models import PetListing
from django.core.paginator import Paginator


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
@permission_classes([IsAuthenticated])
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
            return Response({'error': 'You are not allowed to see this profile'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        # Check that the request is from the user themselves
        if request.user == seeker:
            # Payloads: name(?), email, location, phone, avatar, password, notification, preference
            # Since there isn't a 'name' attribute for PetPalUser, I'll skip it.
            seeker.email = request.data.get('email', seeker.email)
            seeker.address = request.data.get('address', seeker.address)
            seeker.city = request.data.get('city', seeker.city)
            seeker.province = request.data.get('province', seeker.province)
            seeker.postal_code = request.data.get('postal_code', seeker.postal_code)
            seeker.phone = request.data.get('phone', seeker.phone)
            seeker.avatar = request.data.get('avatar', seeker.avatar)
            seeker.password = request.data.get('password', seeker.password)  # not sure if we should have password?

            # TODO: Update notifications/preferences

            serializer = SeekerSerializer(seeker, many=False)

            return Response({'msg': 'Update Seeker', 'user_data': serializer.data}, status=status.HTTP_200_OK)

        return Response({'error': 'You are not allowed to edit this profile'}, status=status.HTTP_403_FORBIDDEN)


'''
VIEW A seeker's favorite pets
ENDPOINT: /api/seekers/<int:account_id>/favorites
METHOD: GET
PERMISSION:
SUCCESS:
'''


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seeker_favorites_view(request, account_id):
    # Check that the account_id exists
    try:
        seeker = Seeker.objects.get(id=account_id)
    except Seeker.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check that only user can see this page
    if request.user != seeker:
        return Response({'error': 'You are not allowed to see this page'}, status=status.HTTP_403_FORBIDDEN)

    # Retrieve all the favorite pets' names
    fav_pets = PetListing.objects.get(favorited_by=seeker)
    # fav_pet_serializer = FavPetSerializer(fav_pets, many=True)
    data = []

    # -- Pagination --
    # Picks how many shelters to show per page
    paginator = Paginator(fav_pets, per_page=3)
    # Retrieve page number
    page_num = request.GET.get("page", 1)
    # Get shelters from that page number
    page_obj = paginator.get_page(page_num)

    # Append each pet of the page in data lst
    for pet in page_obj.object_list:
        data.append({
            'id': pet.pk,
            'name': pet.name,
            'category': pet.category,
            'breed': pet.breed,
            'age': pet.age,
            'gender': pet.gender,
            'size': pet.size,
            'status': pet.status,
            'med_history': pet.med_history,
            'behaviour': pet.behaviour,
            'special_needs': pet.special_needs,
            'description': pet.description
        })

    payload = {
        "page": {
            "current": page_obj.number,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
        },
        "msg": f'{seeker.email} Favorites',
        "data": data
    }

    return Response(payload, status=status.HTTP_200_OK)


'''
VIEW A seeker's favorite pets add/delete
ENDPOINT: /api/seekers/<int:account_id>/favorites/<int:pet_id>
METHOD: POST, DELETE
PERMISSION:
SUCCESS:
'''


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def seeker_favorites_edit_view(request, account_id, pet_id):
    # Check that the account_id exists
    try:
        seeker = Seeker.objects.get(id=account_id)
    except Seeker.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check that only user can see this page
    if request.user != seeker:
        return Response({'error': 'You are not allowed to see this page'}, status=status.HTTP_403_FORBIDDEN)

    # Check that the pet_id exists
    try:
        pet_listing = PetListing.objects.get(id=pet_id)
    except PetListing.DoesNotExist:
        return Response({'error': 'Pet listing does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "POST":
        # Add the user to the favorited_by field of pet_listing
        pet_listing.favorited_by.add(seeker)
        return Response({'msg': f'Added {pet_listing.id} to favorites'}, status=status.HTTP_200_OK)

    if request.method == "DELETE":
        # Delete the user from the favorited_by field of pet_listing
        pet_listing.favorited_by.remove(seeker)
        return Response({'msg': f'Removed {pet_listing.id} from favorites'}, status=status.HTTP_200_OK)


