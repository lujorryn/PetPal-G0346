# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from django.http import JsonResponse
from .models import PetListing, PetListingImage
from accounts.models import PetPalUser as User
from accounts.models import Shelter
from .serializers import PetListingSerializer

# Create your views here.
'''
LIST All Petlistings from a Shelter
ENDPOINT: /api/petlistings/shelter/<str:shelter_email>/
METHOD: Get
PERMISSION: User logged in
SUCCESS:
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def shelter_petlistings_list_view(request, shelter_email):
    paginator = PageNumberPagination()
    paginator.page_size = 6
    
    try:
        all_petlistings = PetListing.objects.filter(owner=User.objects.get(email=shelter_email))
        paginated_petlistings = paginator.paginate_queryset(all_petlistings, request)
        data = []
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
    except:
        return Response({'error': 'Shelter does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    

# To also retrieve current_page and total_pages 
class CustomPaginator(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'current_page': self.page.number,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })

'''
LIST All Petlistings with or without filter / CREATE New Petlisting
ENDPOINT: /api/petlistings
METHOD: Get, POST
PERMISSION: User logged in for GET, User logged in and is a shelter for POST
SUCCESS:
'''
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def petlistings_list_and_create_view(request):
    if request.method == 'GET':
        filter = {}
        allowed_params = ['category', 'age', 'status', 'gender', 'size', 'shelter_email', 'name', 'sort_by', 'ascending']
        sort_by = None

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
                elif param == 'sort_by' and param_value not in ['none', 'name', 'created_time', 'last_updated', 'age']:
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                elif param == 'ascending' and param_value not in ['true', 'false']:
                    return Response({'error': f'Invalid {param}'}, status=status.HTTP_400_BAD_REQUEST)
                
                if param != 'shelter_email' and param != 'sort_by' and param != 'ascending':
                    filter[param] = param_value
                elif param == 'sort_by' and param_value != 'none':
                    sort_by = param_value
                elif param == 'ascending' and sort_by and param_value == 'false':
                    sort_by = '-' + sort_by
                elif param == 'shelter_email':
                    filter['owner'] = User.objects.get(email=param_value)
            if param == 'status' and (param_value is None or str(param_value).strip() == ''): # Default status is available
                filter[param] = 'AV'
                
        data = []
        paginator = CustomPaginator()
        paginator.page_size = 6
        
        if sort_by:
            petlistings = PetListing.objects.filter(**filter).order_by(sort_by)
        else:
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
                'last_updated': listing.last_updated,
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
        
        serializer = PetListingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            pet_listing = serializer.save(owner=request.user)
            
            photos = request.FILES.getlist('photos', None)
            if photos:
                for photo in photos:
                    PetListingImage.objects.create(petlisting=pet_listing, image=photo)
            
            pet_listing.refresh_from_db()
            serializer = PetListingSerializer(instance=pet_listing)
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)

        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
                'last_updated': listing.last_updated,
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
                return Response({'error': 'User not authorized to edit this petlisting'}, status=status.HTTP_401_UNAUTHORIZED)
            serializer = PetListingSerializer(instance=PetListing.objects.get(pk=pet_id), data=request.data, context={'request': request})
            if serializer.is_valid():
                pet_listing = serializer.save()
                
                photos = request.FILES.getlist('photos', None)
                if photos:
                    for photo in photos:
                        PetListingImage.objects.create(petlisting=pet_listing, image=photo)
                
                pet_listing.refresh_from_db()
                serializer = PetListingSerializer(instance=pet_listing)
                return Response({'data': serializer.data}, status=status.HTTP_200_OK)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Petlisting does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        try:
            if request.user != PetListing.objects.get(pk=pet_id).owner:
                return Response({'error': 'User not authorized to delete this petlisting'}, status=status.HTTP_401_UNAUTHORIZED)
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
        return Response({'error': 'User not authorized to delete this photo'}, status=status.HTTP_401_UNAUTHORIZED)
    PetListingImage.objects.get(pk=photo_id).delete()
    return Response({'data': 'Photo deleted'}, status=status.HTTP_200_OK)
    