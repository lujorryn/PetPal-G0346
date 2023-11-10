# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from django.http import JsonResponse
from .models import PetListing, PetListingImage
from accounts.models import PetPalUser as User

# Create your views here.

'''
LIST All Petlistings with or without filter / CREATE New Petlisting
ENDPOINT: /api/petlistings
METHOD: POST
PERMISSION: User logged in for GET, User logged in and is a shelter for POST
SUCCESS:
'''
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def petlistings_list_and_create_view(request):
    if request.method == 'GET':
        filter = {}
        allowed_params = ['category', 'age', 'status', 'gender', 'size', 'shelter_email', 'name']

        for param in allowed_params:
            param_value = request.GET.get(param, None)
            if param_value is not None and str(param_value).strip() != '':
                # Validate the parameter if needed
                if param == 'category' and param_value not in ['D', 'C', 'O']:
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                elif param == 'age' and int(param_value) < 0:
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                elif param == 'status' and param_value not in ['AV', 'AD', 'PE', 'WI']:
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                elif param == 'gender' and param_value not in ['M', 'F', 'X']:
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                elif param == 'size' and param_value not in ['L', 'M', 'S']:
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                elif param == 'shelter_email' and not User.objects.filter(email=param_value).exists():
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                elif param == 'name' and param_value.strip() == '':
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                
                if param != 'shelter_email':
                    filter[param] = param_value
                else:
                    filter['owner'] = User.objects.get(email=param_value)
            if param == 'status' and (param_value is None or str(param_value).strip() == ''): # Default status is available
                filter[param] = 'AV'
                
        data = []
        paginator = PageNumberPagination()
        paginator.page_size = 2
        
        petlistings = PetListing.objects.filter(**filter)
        paginated_petlistings = paginator.paginate_queryset(petlistings, request)
        for listing in paginated_petlistings:
            result = {
                'id': listing.pk,
                'name': listing.name,
                'category': listing.category,
                'breed': listing.breed,
                'age': listing.age,
                'gender': listing.gender,
                'size': listing.size,
                'status': listing.status,
                'created_time': listing.created_time,
                'med_history': listing.med_history,
                'behaviour': listing.behaviour,
                'special_needs': listing.special_needs,
                'description': listing.description,
                'owner': listing.owner.email,
            }
            result['photos'] = []
            for image in listing.images.all():
                result['photos'].append({
                    'id': image.pk,
                    'url': image.image.url
                })
            data.append(result)
        return paginator.get_paginated_response({'data': data})

    if request.method == 'POST':
        if request.user.role != User.Role.SHELTER:
            return Response({'error': 'User not authorized to create petlisting'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if all required fields are present and not null
        required_fields = ['name', 'category', 'age', 'gender', 'size', 'description']
        for field in required_fields:
            if not request.data.get(field) or str(request.data.get(field)).strip() == '':
                return Response({'error': f'{field} is required and cannot be null'}, status=status.HTTP_400_BAD_REQUEST)

        name = request.data.get('name')
        if name.strip() == '':
            return Response({'error': 'Name cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
        category = request.data.get('category')
        if category not in ['D', 'C', 'O']:
            return Response({'error': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)
        breed = request.data.get('breed', 'N/A')
        age = request.data.get('age')
        if int(age) < 0:
            return Response({'error': 'Invalid age'}, status=status.HTTP_400_BAD_REQUEST)
        gender = request.data.get('gender')
        if gender not in ['M', 'F', 'X']:
            return Response({'error': 'Invalid gender'}, status=status.HTTP_400_BAD_REQUEST)
        size = request.data.get('size')
        if size not in ['L', 'M', 'S']:
            return Response({'error': 'Invalid size'}, status=status.HTTP_400_BAD_REQUEST)
        
        med_history = request.data.get('med_history', 'N/A')
        behaviour = request.data.get('behaviour', 'N/A')
        special_needs = request.data.get('special_needs', 'N/A')
        description = request.data.get('description')
        if description.strip() == '':
            return Response({'error': 'Description cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
        new_listing = PetListing(
            name=name,
            category=category,
            breed=breed,
            age=age,
            gender=gender,
            size=size,
            med_history=med_history,
            behaviour=behaviour,
            special_needs=special_needs,
            description=description,
            owner=request.user
        )
        new_listing.save()
        photos = request.FILES.getlist('photos', None)
        if photos:
            for photo in photos:
                new_image = PetListingImage(image=photo, petlisting=new_listing)
                new_image.save()
        return Response({'data': f'Petlisting for {name} created'}, status=status.HTTP_200_OK)

'''
VIEW / EDIT / DELETE A petlisting
ENDPOINT: /api/petlistings/<int:pet_id>/
METHOD: GET, PUT, DELETE
PERMISSION: 
GET: User logged in
PUT/DELETE: User logged in and is the owner of the petlisting
SUCCESS:
'''
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def petlisting_detail_view(request, pet_id):
    if request.method == 'GET':
        try:
            listing = PetListing.objects.get(pk=pet_id)
            data = {
                'id': listing.pk,
                'name': listing.name,
                'category': listing.category,
                'breed': listing.breed,
                'age': listing.age,
                'gender': listing.gender,
                'size': listing.size,
                'status': listing.status,
                'created_time': listing.created_time,
                'med_history': listing.med_history,
                'behaviour': listing.behaviour,
                'special_needs': listing.special_needs,
                'description': listing.description,
                'owner': listing.owner.email,
            }
            data['photos'] = []
            for image in listing.images.all():
                data['photos'].append({
                    'id': image.pk,
                    'url': image.image.url
                })
            return Response({'data': data}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Petlisting does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        try:
            if request.user != PetListing.objects.get(pk=pet_id).owner:
                return Response({'data': 'User not authorized to edit this petlisting'}, status=status.HTTP_401_UNAUTHORIZED)
            required_fields = ['name', 'category', 'age', 'gender', 'size', 'status', 'description']
            for field in required_fields:
                if not request.data.get(field) or str(request.data.get(field)).strip() == '':
                    return Response({'data': f'{field} is required and cannot be null'}, status=status.HTTP_400_BAD_REQUEST)

            name = request.data.get('name')
            category = request.data.get('category')
            if category not in ['D', 'C', 'O']:
                return Response({'error': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)
            breed = request.data.get('breed')
            age = request.data.get('age')
            if int(age) < 0:
                return Response({'error': 'Invalid age'}, status=status.HTTP_400_BAD_REQUEST)
            gender = request.data.get('gender')
            if gender not in ['M', 'F', 'X']:
                return Response({'error': 'Invalid gender'}, status=status.HTTP_400_BAD_REQUEST)
            size = request.data.get('size')
            if size not in ['L', 'M', 'S']:
                return Response({'error': 'Invalid size'}, status=status.HTTP_400_BAD_REQUEST)
            pet_status = request.data.get('status')
            if pet_status not in ['AV', 'AD', 'PE', 'WI']:
                return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
            med_history = request.data.get('med_history')
            behaviour = request.data.get('behaviour')
            special_needs = request.data.get('special_needs')
            description = request.data.get('description')
            listing = PetListing.objects.get(pk=pet_id)
            listing.name = name
            listing.category = category
            if breed:
                listing.breed = breed
            listing.age = age
            listing.gender = gender
            listing.size = size
            listing.status = pet_status
            if med_history:
                listing.med_history = med_history
            if behaviour:
                listing.behaviour = behaviour
            if special_needs:
                listing.special_needs = special_needs
            listing.description = description
            listing.save()
            
            photos = request.FILES.getlist('photos', None)
            if photos:
                for photo in photos:
                    new_image = PetListingImage(image=photo, petlisting=listing)
                    new_image.save()
            return Response({'data': 'Petlisting updated'}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Petlisting does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        try:
            if request.user != PetListing.objects.get(pk=pet_id).owner:
                return Response({'data': 'User not authorized to delete this petlisting'}, status=status.HTTP_401_UNAUTHORIZED)
            PetListing.objects.get(pk=pet_id).delete()
            return Response({'data': 'Petlisting deleted'}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Petlisting does not exist'}, status=status.HTTP_400_BAD_REQUEST)

'''
DELETE A petlisting's photo
ENDPOINT: /api/petlistings/<int:pet_id>/<int:photo_id>/
METHOD: DELETE
PERMISSION: 
DELETE: User logged in and is the owner of the petlisting
SUCCESS:
'''
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def petlisting_photo_view(request, pet_id, photo_id):
    if request.user != PetListing.objects.get(pk=pet_id).owner:
        return Response({'data': 'User not authorized to delete this photo'}, status=status.HTTP_401_UNAUTHORIZED)
    PetListingImage.objects.get(pk=photo_id).delete()
    return Response({'data': 'Photo deleted'}, status=status.HTTP_200_OK)
    