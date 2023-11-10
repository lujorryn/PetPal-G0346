# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from django.http import JsonResponse

# Create your views here.

'''
LIST All Petlistings / CREATE New Petlisting
ENDPOINT: /api/petlistings
METHOD: GET, POST
PERMISSION:
SUCCESS:
'''
@api_view(['GET', 'POST'])
def petlistings_list_and_create_view(request):
    if request.method == 'GET':
        return Response({'msg': 'all petlistings'}, status=status.HTTP_200_OK)

    if request.method == 'POST':
        return Response({'msg': 'create petlisting'}, status=status.HTTP_200_OK)

'''
LIST All Petlistings within category
ENDPOINT: /api/petlistings/<str:category>
METHOD: GET
PERMISSION:
'''
@api_view(['GET'])
def petlistings_category_list_view(request, category):
    return Response({'msg': 'category petlistings'}, status=status.HTTP_200_OK)


'''
VIEW / EDIT / DELETE A petlisting
ENDPOINT: /api/petlistings/<int:pet_id>/
METHOD: GET, PUT, DELETE
PERMISSION:
SUCCESS:
'''
@api_view(['GET', 'PUT', 'DELETE'])
def petlisting_detail_view(request, pet_id):
    if request.method == 'GET':
        return Response({'msg': 'petlisting detail'}, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        return Response({'msg': 'edit petlisting'}, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        print(request.method)
        return Response({'msg': 'delete petlisting'}, status=status.HTTP_200_OK)
