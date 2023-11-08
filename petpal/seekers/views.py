# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

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
@api_view(['GET', 'PUT', 'DELETE'])
def seeker_detail_view(request, account_id):
    if request.method == 'GET':
        return Response({'msg': 'seeker detail'}, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        return Response({'msg': 'edit seeker'}, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        return Response({'msg': 'delete seeker'}, status=status.HTTP_200_OK)
