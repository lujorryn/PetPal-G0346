# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination


from .models import Application
from .serializers import ApplicationSerializer
from django.http import JsonResponse
from django.contrib.contenttypes.models import ContentType



from petlistings.models import PetListing
from accounts.models import PetPalUser
from notifications.models import Notification



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
        return paginator.get_paginated_response({'data': serialized_apps.data})

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

        v = validate_data(data)
        ok, err = v[0], v[1]
        
        if not ok:
            return Response({'error': f'invalid {err}'}, status=status.HTTP_400_BAD_REQUEST)

    
        
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
            pet_number=int(data['pet_number']),
            has_children=get_boolean(data["has_children"]),
            experience=data['experience'],
            residence_type=data['residence_type'],
            status=data['status'],
            seeker=curr_user,
            shelter=listing.owner,
            petlisting=listing,
        )



        subject = f'application with id {new_app.pk} created.'
        body = f'user: {new_app.email}, petlisting: {new_app.petlisting.pk}'

        new_notif = Notification(subject=subject, 
                                    body=body, 
                                    content_type=ContentType.objects.get_for_model(Application), 
                                    object_id=new_app.pk, 
                                    content_object=new_app)
        # save initial new_notif 
        new_notif.save()
        # save again with valid shelter
        new_notif.recipients.add(new_app.shelter)
        new_notif.save()

        success_url = f'/api/applications/{new_app.pk}'
        return Response({'redirect_url': success_url}, status=status.HTTP_201_CREATED)


    else:
        return Response({'error': 'request type not supported'}, status=status.HTTP_400_BAD_REQUEST)


'''
helper func for converting string 'true/True' values
'''
def get_boolean(field) -> bool:
    field = str(field).lower()
    if field == 'true':
        return True
    elif field == 'false':
        return False
    else:
        return Response({'error': 'invalid form-data'}, status=status.HTTP_400_BAD_REQUEST)


'''
custom validator
returns ok: bool, err: str
'''
def validate_data(data) -> (bool, str):
    ok = True
    err = "all good"

    charfield_255 = ['first_name', 'last_name', 'address', 'email']
    charfield_20 = ['phone']
    charfield_2 = ['experience']
    charfield_1 = ['contact_pref', 'residence_type', 'status']
    is_int = ['pet_number']
    is_bool = ['has_children']


    for field, value in data.items():
        if value == "":
            ok = False
            err = field 
        elif field in charfield_255 and len(value) > 255:
            ok = False
            err = field
        elif field in charfield_20 and len(value) > 20:
            ok = False
            err = field
        elif field in charfield_2 and len(value) > 2:
            ok = False
            err = field
        elif field in charfield_1 and len(value) > 1:
            ok = False
            err = field
        elif field in is_int:
            try:
                int(value)
            except ValueError:
                ok = False
                err = field
        elif field in is_bool and value.lower() not in ['true', 'false']:
            ok = False
            err = field
        else:
            pass
        if not ok:
            return (ok, err)
    
    return (ok, err)


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
        try:
            listing = PetListing.objects.get(pk=pet_id)
        except PetListing.DoesNotExist:
            return Response({'error': 'invalid pet id'}, status=status.HTTP_400_BAD_REQUEST)


        if listing.owner != curr_user:
            return Response({'error': 'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        
        apps = Application.objects.filter(petlisting=pet_id)
        paginator = PageNumberPagination()
        paginator.page_size = 10
        
        paginated_apps = paginator.paginate_queryset(apps, request)

        serialized_apps = ApplicationSerializer(data=paginated_apps, many=True)
        serialized_apps.is_valid()

        return paginator.get_paginated_response({'data': serialized_apps.data})
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
        try:
            app = Application.objects.get(pk=app_id)
        except Application.DoesNotExist:
            return Response({'error':'app id not found'}, status=status.HTTP_400_BAD_REQUEST)

        if app.seeker !=  request.user and app.shelter != request.user:
            return Response({'error':'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        serialized_app = ApplicationSerializer(app)
        return JsonResponse({'data': serialized_app.data}, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        data = {
            "status" : request.data.get('status', ''),
        }


        try:
            put_app = Application.objects.get(pk=app_id)
        except Application.DoesNotExist:
            return Response({'error':'app id not found'}, status=status.HTTP_400_BAD_REQUEST)

       

        new_status = data["status"]

        if new_status == put_app.status:
            return Response({'error':'status did not change'}, status=status.HTTP_400_BAD_REQUEST)
        
        curr_user = PetPalUser.objects.get(pk=request.user.id)

        if curr_user.role == PetPalUser.Role.SHELTER:
            if put_app.shelter != curr_user:
                return Response({'error':'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

            if new_status not in ['A', 'D']:
                return Response({'error':f'invalid status: {new_status}'}, status=status.HTTP_400_BAD_REQUEST)

        elif curr_user.role == PetPalUser.Role.SEEKER:
            if put_app.seeker != curr_user:
                return Response({'error':'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

            if new_status not in ['W']:
                return Response({'error':f'invalid status: {new_status}'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error':f'invalid user role: {curr_user.role}'}, status=status.HTTP_400_BAD_REQUEST)

        put_app.status = new_status
        put_app.save()

        
        subject = f'application with id {put_app.pk} got updated.'
        body = f'updated status: {put_app.status}'
        new_notif = Notification(subject=subject, body=body, 
                                    content_type=ContentType.objects.get_for_model(Application), 
                                    object_id=put_app.pk, content_object=put_app)
        
        new_notif.save()
        # add recipients and save 
        if curr_user.role == PetPalUser.Role.SHELTER:
            if put_app.seeker.is_notif_status:
                new_notif.recipients.add(put_app.seeker)
        else:
            new_notif.recipients.add(put_app.shelter)

        new_notif.save()

        success_url = f'/api/applications/{put_app.pk}'
        return Response({'redirect_url': success_url}, status=status.HTTP_201_CREATED)

    else:
        return Response({'error': 'method not accepted'}, status=status.HTTP_404_NOT_FOUND)