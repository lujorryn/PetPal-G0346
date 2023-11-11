# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination


from .models import Application
from .serializers import ApplicationSerializer
from django.http import JsonResponse


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
@permission_classes([IsAuthenticated])
def applications_list_and_create_view(request):
    if request.method == 'GET':
        curr_user = PetPalUser.objects.get(pk=request.user.id)
        status_filter = request.query_params.get('status')
        sort_option = request.query_params.get('sort')
        
        
        if curr_user.role == PetPalUser.Role.SHELTER:
            all_apps = Application.objects.filter(shelter=curr_user)
        elif curr_user.role == PetPalUser.Role.SEEKER:
            all_apps = Application.objects.filter(seeker=curr_user)
        else:
            return Response({'error':f'invalid user role: {curr_user.role}'}, status=status.HTTP_400_BAD_REQUEST)


        if status_filter in Application.ALLOWED_STATUS:
            all_apps = all_apps.filter(status=status_filter)

        if sort_option == 'created_time':
            all_apps = all_apps.order_by('-created_time')
        elif sort_option == 'last_updated':
            all_apps = all_apps.order_by('-last_updated')
        else:
            all_apps = all_apps.order_by('-created_time')


        paginator = PageNumberPagination()
        paginator.page_size = 10

        paginated_apps = paginator.paginate_queryset(all_apps, request)

        serialized_apps = ApplicationSerializer(data=paginated_apps, many=True)
        serialized_apps.is_valid()
        return JsonResponse({'data': serialized_apps.data}, status=status.HTTP_200_OK)

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
                return Response({'error': f'{field} cannot be blank'})
    
        
        try:
            curr_user = PetPalUser.objects.get(pk=request.user.id)
        except PetPalUser.DoesNotExist:
            return Response({'error': 'user invalid'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            listing = PetListing.objects.get(id=data['petlisting_id'])    
        except PetListing.DoesNotExist:
            return Response({'error': 'petlisintg invalid'}, status=status.HTTP_400_BAD_REQUEST)

        if listing.status != "AV":
            return Response({'error': 'petlisintg unavailable'}, status=status.HTTP_400_BAD_REQUEST)

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
            shelter=listing.owner,
            petlisting=listing,
        )

        success_url = f'/api/applications/{new_app.pk}'
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
@permission_classes([IsAuthenticated])
def pet_applications_list_view(request, pet_id):
    if request.method == 'GET':
        curr_user = PetPalUser.objects.get(pk=request.user.id)
        listing = PetListing.objects.get(pk=pet_id)

        if listing.owner != curr_user:
            return Response({'error': 'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        
        apps = Application.objects.filter(petlisting=pet_id)
        paginator = PageNumberPagination()
        paginator.page_size = 10
        
        paginated_apps = paginator.paginate_queryset(apps, request)

        serialized_apps = ApplicationSerializer(data=paginated_apps, many=True)
        serialized_apps.is_valid()

        return JsonResponse({'data': serialized_apps.data}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'method not accepted'}, status=status.HTTP_404_NOT_FOUND)

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
        app = Application.objects.get(pk=app_id)
        serialized_app = ApplicationSerializer(app)
        return JsonResponse({'data': serialized_app.data}, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = {
            "status" : request.data.get('status', ''),
        }

        put_app = Application.objects.get(pk=app_id)
       
        new_status = data["status"]

        if new_status == put_app.status:
            return Response({'error':'status did not change'}, status=status.HTTP_400_BAD_REQUEST)
        
        curr_user = PetPalUser.objects.get(pk=request.user.id)

        if curr_user.role == PetPalUser.Role.SHELTER:
            if new_status not in ['A', 'D']:
                return Response({'error':f'invalid status: {new_status}'}, status=status.HTTP_400_BAD_REQUEST)
        elif curr_user.role == PetPalUser.Role.SEEKER:
            if new_status not in ['W']:
                return Response({'error':f'invalid status: {new_status}'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error':f'invalid user role: {curr_user.role}'}, status=status.HTTP_400_BAD_REQUEST)

        put_app.status = new_status
        put_app.save()

        success_url = f'/api/applications/{put_app.pk}'
        return Response({'redirect_url': success_url}, status=status.HTTP_201_CREATED)

    else:
        return Response({'error': 'method not accepted'}, status=status.HTTP_404_NOT_FOUND)