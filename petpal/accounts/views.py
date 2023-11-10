# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import OutstandingToken, BlacklistedToken
from rest_framework.views import APIView

from .models import PetPalUser
from .serializers import SignupSerializer

# region LOGIN: using token authentication only
'''
LOGIN User
ENDPOINT: /api/token/ (see main app's urls.py)
METHOD: POST
PAYLOAD: email, password
SUCCESS: refresh and access tokens
'''
# endregion

# region CREATE
'''
CREATE User (Shelter/Seeker)
ENDPOINT: /api/accounts/new-account
METHOD: POST
PAYLOAD: first_name, last_name, email, password, confirm_password, account_type
SUCCESS: status=200, msg="User <user_id>: <SEEKER/SHELTER> successfully created"
ERROR: status=error status, error=error message
'''
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    serializer = SignupSerializer(data=request.data)

    if serializer.is_valid():
        try:
            new_user = serializer.save()
            return Response({"msg": f"User {new_user.id}: {new_user.role} successfully created"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# endregion

# region DELETE
'''
DELETE account
ENDPOINT: /api/accounts/<str:account_id>
METHOD: DELETE
PERMISSION: Account holder
SUCCESS: status=200, msg="User <user_id> deleted"
'''
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def account_delete_view(request, account_id):
    if account_id != request.user.id:
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN )
    
    try:
        user = PetPalUser.objects.get(pk=account_id)
        user.delete()
        return Response({'msg': f'User {account_id} deleted'}, status=status.HTTP_200_OK)
    except PetPalUser.DoesNotExist:
        return Response({'error': 'No such user'}, status=status.HTTP_404_NOT_FOUND)
# endregion

# region LOGOUT
'''
LOGOUT of seeker/shelter account
ENDPOINT: /api/accounts/logout
METHOD: POST
PERMISSION: Logged In
SUCCESS: status=205, msg="Refresh token blacklisted"
'''
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            tokens = OutstandingToken.objects.filter(user_id=request.user.id)
            for token in tokens:
                t, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response({'msg': 'Refresh token blacklisted'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
# endregion