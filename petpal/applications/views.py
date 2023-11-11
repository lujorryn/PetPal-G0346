# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from django.http import JsonResponse

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
        return Response({'msg': 'all applications'}, status=status.HTTP_200_OK)

    if request.method == 'POST':
        return Response({'msg': 'create application'}, status=status.HTTP_200_OK)

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
