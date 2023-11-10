# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import Notification

# Create your views here.

'''
LIST All Notifications of a User
ENDPOINT: /api/notifications
METHOD: GET
PERMISSION: User logged in
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_list_view(request):
    paginator = PageNumberPagination()
    paginator.page_size = 4
    
    notifications = Notification.objects.filter(recipients=request.user)
    paginated_notifications = paginator.paginate_queryset(notifications, request)
    
    data = []
    for notification in paginated_notifications:
        data.append({
            'id': notification.pk,
            'subject': notification.subject,
            'body': notification.body,
            'content_type': notification.content_type.model,
            'object_id': notification.object_id,
        })
    return paginator.get_paginated_response({'data': data})

'''
VIEW / DELETE A Notification
ENDPOINT: /api/notifications/<int:note_id>/
METHOD: GET, DELETE
PERMISSION: User logged in and must be the recipient of the notification
SUCCESS:
'''
@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def notifications_detail_view(request, note_id):
    if request.method == 'GET':
        notification = Notification.objects.get(pk=note_id)
        if request.user not in notification.recipients.all():
            return Response({'error': 'User not authorized to view this notification'}, status=status.HTTP_401_UNAUTHORIZED)
        data = {
            'id': notification.pk,
            'subject': notification.subject,
            'body': notification.body,
            'content_type': notification.content_type.model,
            'object_id': notification.object_id,
        }
        return Response({'data': data}, status=status.HTTP_200_OK)


    if request.method == 'DELETE':
        notification = Notification.objects.get(pk=note_id)
        if request.user not in notification.recipients.all():
            return Response({'error': 'User not authorized to delete this notification'}, status=status.HTTP_401_UNAUTHORIZED)
        # Delete only the association with the user
        notification.recipients.remove(request.user)
        notification.save()
        if notification.recipients.count() == 0:
            notification.delete()
        return Response({'msg': 'Notification deleted'}, status=status.HTTP_200_OK)