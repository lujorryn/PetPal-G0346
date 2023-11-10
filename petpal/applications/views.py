# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from .models import Application
from .serializers import ApplicationSerializer
from django.http import JsonResponse
from rest_framework.authtoken.models import Token


from petlistings.models import PetListing
from accounts.models import PetPalUser



# Create your views here.

'''
LIST All Applications / CREATE New Application
ENDPOINT: /api/applications
METHOD: GET, POST
PERMISSION:
SUCCESS:
'''

@api_view(['GET', 'POST'])
def applications_list_and_create_view(request):
    if request.method == 'GET':
        # todo: user auth
        print(request.user.id)

        # user_id = Token.objects.get(key=request.).user_id
        # user = PetPalUser.objects.get(id=user_id)
        # print(user)

        curr_user = PetPalUser.objects.first()
        
        all_apps = Application.objects.filter(seeker=curr_user)
        serialized_apps = ApplicationSerializer(all_apps, many=True)
        return JsonResponse({'applications': serialized_apps.data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        data = {
            "first_name" : request.POST.get('first_name', ''),
            "last_name" : request.POST.get('last_name', ''),
            "address" : request.POST.get('address', ''),
            "phone" : request.POST.get('phone', ''),
            "email" : request.POST.get('email', ''),
            "contact_pref" : request.POST.get('contact_pref', ''),
            "pet_number" : request.POST.get('pet_number', ''),
            "has_children" : request.POST.get('has_children', ''),
            "experience" : request.POST.get('experience', ''),
            "residence_type" : request.POST.get('residence_type', ''),
            "status" : request.POST.get('status', ''),
            "petlisting_id" : request.POST.get('petlisting_id', '')
        }


        for field, value in data.items():
            if value == "":
                return Response({'error': f'${field} cannot be blank'})
    
        
        try:
            curr_user = PetPalUser.objects.get(email=data['email'])
        except PetPalUser.DoesNotExist:
            return Response({'error': 'email invalid'}, status=status.HTTP_400_BAD_REQUEST)

        
        try:
            listing = PetListing.objects.get(id=data['petlisting_id'])    
        except PetListing.DoesNotExist:
            return Response({'error': 'petlisintg invalid'}, status=status.HTTP_400_BAD_REQUEST)


        new_app = Application.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            address=data['address'],
            phone=data['phone'],
            email=data['email'],
            contact_pref=data['contact_pref'],
            pet_number=data['pet_number'],
            has_children=get_boolean(data["has_children"]),
            experience=data['experience'],
            residence_type=data['residence_type'],
            status=data['status'],
            seeker=curr_user,
            petlisting=listing,
        )

        success_url = f'/api/applications/${new_app.pk}'
        return Response({'redirect_url': success_url}, status=status.HTTP_201_CREATED)


    else:
        return Response({'error': 'request type not supported'}, status=status.HTTP_400_BAD_REQUEST)


'''
helper func for converting string 'true/True' values
'''
def get_boolean(field) -> bool:
    return str(field).lower()=='true' 


'''
LIST All Applications of a Petlisting
ENDPOINT: /api/applications/pet/<int:pet_id>
METHOD: GET
PERMISSION:
'''
@api_view(['GET'])
def pet_applications_list_view(request, pet_id):
    return Response({'msg': 'application of pet_id'}, status=status.HTTP_200_OK)


'''
VIEW / EDIT An Application
ENDPOINT: /api/applications/<int:app_id>/
METHOD: GET, PUT
PERMISSION:
SUCCESS:
'''
@api_view(['GET', 'PUT'])
def application_detail_view(request, app_id):
    if request.method == 'GET':
        return Response({'msg': 'application detail'}, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        return Response({'msg': 'edit application'}, status=status.HTTP_200_OK)
