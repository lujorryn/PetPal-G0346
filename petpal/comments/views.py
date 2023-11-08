# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from django.http import JsonResponse

# Create your views here.

'''
CREATE New Comment
ENDPOINT: /api/comments
METHOD: POST
PERMISSION:
SUCCESS:
'''
@api_view(['POST'])
def comment_create_view(request):
    return Response({'msg': 'create comment'}, status=status.HTTP_200_OK)


'''
VIEW A Comment
ENDPOINT: /api/comments/<str:msg_id>
METHOD: GET
PERMISSION:
'''
@api_view(['GET'])
def comment_detail_view(request, msg_id):
    return Response({'msg': 'view comment'}, status=status.HTTP_200_OK)

'''
LIST All Comments of a User's All Applications
ENDPOINT: /api/comments/applications
METHOD: GET
PERMISSION:
FE: Message Center
'''
@api_view(['GET'])
def comments_all_applications_list_view(request):
    return Response({'msg': 'comment center'}, status=status.HTTP_200_OK)

'''
LIST All Comments of a Certain Application
ENDPOINT: /api/comments/applications/<str:app_id>
METHOD: GET
PERMISSION:
FE: Message History with Shelter, Convo Name: Application
'''
@api_view(['GET'])
def comments_application_list_view(request, app_id):
    return Response({'msg': 'comments regarding a certain application'}, status=status.HTTP_200_OK)


'''
LIST All Comments of a Shelter
ENDPOINT: /api/comments/shelter/<str:shelter_id>
METHOD: GET
PERMISSION:
'''
@api_view(['GET'])
def comments_shelter_list_view(request, shelter_id):
    if request.method == 'GET':
        return Response({'msg': 'shelter comments'}, status=status.HTTP_200_OK)
