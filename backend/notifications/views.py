# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.urls import reverse

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
    is_read = request.GET.get('is_read', None)
    sort_by_created_time = request.GET.get('sort_by_created_time', None)

    if is_read is not None:
        if is_read.lower() == 'true' or is_read == True:
            notifications = Notification.objects.filter(recipients=request.user, recipients_read=request.user)
        else:
            notifications = Notification.objects.filter(recipients=request.user).exclude(recipients_read=request.user)
    else:
        notifications = Notification.objects.filter(recipients=request.user).exclude(recipients_read=request.user)
    notifications = notifications.order_by('-created_time')
    if sort_by_created_time == 'asc':
        notifications = notifications.order_by('created_time')
    elif sort_by_created_time == 'desc':
        notifications = notifications.order_by('-created_time')
    paginated_notifications = paginator.paginate_queryset(notifications, request)
    
    data = []
    for notification in paginated_notifications:
        result = {
            'id': notification.pk,
            'subject': notification.subject,
            'body': notification.body,
            'content_type': notification.content_type.model,
            'object_id': notification.object_id,
            'created_time': notification.created_time,
            'creator_avatar': notification.creator.avatar.url if notification.creator.avatar else None,
            'creator_id': notification.creator.pk,
        }
        if notification.content_type.model == 'petlisting':
            pet_listing_url = reverse('petlistings:pelisting-detail', args=[notification.object_id])
            result['link'] = pet_listing_url
            result['status'] = notification.content_object.status
        elif notification.content_type.model == 'comment':
            comment_url = reverse('comments:comment-detail', args=[notification.object_id])
            result['link'] = comment_url
        elif notification.content_type.model == 'application':
            application_url = reverse('applications:applications-detail', args=[notification.object_id])
            result['link'] = application_url
            result['status'] = notification.content_object.status
        result['created_time'] = notification.content_object.created_time
        
        data.append(result)
    return paginator.get_paginated_response({'data': data})

'''
VIEW / DELETE A Notification
ENDPOINT: /api/notifications/<int:note_id>/
METHOD: GET, PUT, DELETE
PERMISSION: User logged in and must be the recipient of the notification
SUCCESS:
'''
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def notifications_detail_view(request, note_id):
    if request.method == 'GET':
        try:
            notification = Notification.objects.get(pk=note_id)
            if request.user not in notification.recipients.all():
                return Response({'error': 'User not authorized to view this notification'}, status=status.HTTP_401_UNAUTHORIZED)
            data = {
                'id': notification.pk,
                'subject': notification.subject,
                'body': notification.body,
                'content_type': notification.content_type.model,
                'object_id': notification.object_id,
                'created_time': notification.created_time,
                'creator_avatar': notification.creator.avatar.url if notification.creator.avatar else None,
                'creator_id': notification.creator.pk,
            }
            if notification.content_type.model == 'petlisting':
                data['status'] = notification.content_object.status
            return Response({'data': data}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        try:
            notification = Notification.objects.get(pk=note_id)
            if request.user not in notification.recipients.all():
                return Response({'error': 'User not authorized to mark this notification as read'}, status=status.HTTP_401_UNAUTHORIZED)
            notification.recipients_read.add(request.user)
            notification.save()
            return Response({'msg': 'Notification marked as read'}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        try:
            notification = Notification.objects.get(pk=note_id)
            if request.user not in notification.recipients.all():
                return Response({'error': 'User not authorized to delete this notification'}, status=status.HTTP_401_UNAUTHORIZED)
            # Delete only the association with the user
            notification.recipients.remove(request.user)
            notification.save()
            if notification.recipients.count() == 0:
                notification.delete()
            return Response({'msg': 'Notification deleted'}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)