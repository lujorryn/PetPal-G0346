# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from django.http import JsonResponse

# Create your views here.

'''
LOGIN User
ENDPOINT: /api/accounts
METHOD: POST
PAYLOAD: email, password
SUCCESS: Response(status=200)
'''
@api_view(['POST'])
def login_view(request):
    return Response({'msg': 'login account'}, status=status.HTTP_200_OK)

'''
CREATE User (Shelter/Seeker)
ENDPOINT: /api/accounts/new-account
METHOD: POST
PAYLOAD: first_name, last_name, email, password, confirm_password
SUCCESS: Response(status=200)
'''
@api_view(['POST'])
def signup_view(request):
    return Response({'msg': 'signup account'}, status=status.HTTP_200_OK)

'''
DELETE account
ENDPOINT: /api/accounts/<str:account_id>
METHOD: DEL
PERMISSION: Account holder
SUCCESS: Response(status=200)
'''
@api_view(['DELETE'])
def account_delete_view(request, account_id):
    return Response({'msg': 'delete account'}, status=status.HTTP_200_OK)

'''
LOGOUT of seeker/shelter account
ENDPOINT: /api/accounts/logout
METHOD: POST
PERMISSION: Logged 
SUCCESS: Response(status=200)
'''
@api_view(['POST'])
def logout_view(request):
    return Response({'msg': 'logout account'}, status=status.HTTP_200_OK)