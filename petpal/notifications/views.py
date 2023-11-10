# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from django.http import JsonResponse
from .models import Notification

# Create your views here.

'''
LIST All Notifications of a User
ENDPOINT: /api/notifications
METHOD: GET
PERMISSION: User logged in
'''
@api_view(['GET'])
def notifications_list_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'data': 'User not logged in'}, status=status.HTTP_401_UNAUTHORIZED)
    notifications = Notification.objects.filter(recipients=request.user)
    data = []
    for notification in notifications:
        data.append({
            'id': notification.pk,
            'subject': notification.subject,
            'body': notification.body,
            'content_type': notification.content_type.model,
            'object_id': notification.object_id,
        })
    return JsonResponse({'data': data}, status=status.HTTP_200_OK)

'''
VIEW / DELETE A Notification
ENDPOINT: /api/notifications/<int:note_id>/
METHOD: GET, DELETE
PERMISSION: User logged in and must be the recipient of the notification
SUCCESS:
'''
@api_view(['GET', 'DELETE'])
def notifications_detail_view(request, note_id):
    if not request.user.is_authenticated:
        return JsonResponse({'data': 'User not logged in'}, status=status.HTTP_401_UNAUTHORIZED)
    if request.method == 'GET':
        notification = Notification.objects.get(pk=note_id)
        if request.user not in notification.recipients.all():
            return JsonResponse({'data': 'User not authorized to view this notification'}, status=status.HTTP_401_UNAUTHORIZED)
        data = {
            'id': notification.pk,
            'subject': notification.subject,
            'body': notification.body,
            'content_type': notification.content_type.model,
            'object_id': notification.object_id,
        }
        return JsonResponse({'data': data}, status=status.HTTP_200_OK)


    if request.method == 'DELETE':
        notification = Notification.objects.get(pk=note_id)
        if request.user not in notification.recipients.all():
            return JsonResponse({'data': 'User not authorized to delete this notification'}, status=status.HTTP_401_UNAUTHORIZED)
        # Delete only the association with the user
        notification.recipients.remove(request.user)
        notification.save()
        if notification.recipients.count() == 0:
            notification.delete()
        return JsonResponse({'data': 'Notification deleted'}, status=status.HTTP_200_OK)