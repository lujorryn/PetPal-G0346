# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from django.http import JsonResponse

# Create your views here.

'''
LIST All Notifications of a User
ENDPOINT: /api/notifications
METHOD: GET
PERMISSION:
'''
@api_view(['GET'])
def notifications_list_view(request):
    return Response({'msg': 'all notifications of user'}, status=status.HTTP_200_OK)

'''
VIEW / EDIT / DELETE A Notification
ENDPOINT: /api/notifications/<str:note_id>/
METHOD: GET, PUT, DELETE
PERMISSION:
SUCCESS:
'''
@api_view(['GET', 'PUT', 'DELETE'])
def notifications_detail_view(request, note_id):
    if request.method == 'GET':
        return Response({'msg': 'notification detail'}, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        return Response({'msg': 'mark notification as read'}, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        return Response({'msg': 'delete notification'}, status=status.HTTP_200_OK)
