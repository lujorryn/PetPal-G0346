# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

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
    return Response({'msg': 'all shelters'}, status=status.HTTP_200_OK)

'''
VIEW / EDIT / DELETE A shelter
ENDPOINT: /api/shelters/<str:account_id>/
METHOD: GET, PUT, DELETE
PERMISSION:
SUCCESS:
'''
@api_view(['GET', 'PUT', 'DELETE'])
def shelter_detail_view(request, account_id):
    if request.method == 'GET':
        return Response({'msg': 'shelter detail'}, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        return Response({'msg': 'edit shelter'}, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        return Response({'msg': 'delete shelter'}, status=status.HTTP_200_OK)
