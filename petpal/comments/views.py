# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from applications.models import Application
from .models import Comment
from accounts.models import PetPalUser as User

# Create your views here.

'''
CREATE New Comment
ENDPOINT: /api/comments
METHOD: POST
PERMISSION: User logged in and must be part of the application if is_review == False
SUCCESS:
'''
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comment_create_view(request):
    is_author_seeker = request.data.get('is_author_seeker')
    is_review = request.data.get('is_review')
    content = request.data.get('content')
    seeker_email = request.data.get('seeker_email')
    shelter_email = request.data.get('shelter_email')
    if is_review == None or is_author_seeker == None or content == None or seeker_email == None or shelter_email == None:
        return Response({'data': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)
    if is_review == False:
        application_id = request.data.get('application_id')
        try:
            application = Application.objects.get(pk=application_id)
            # Check if user is part of the application
            if request.user != application.seeker and request.user != application.petlisting.owner:
                return Response({'data': 'User not authorized to comment on this application'}, status=status.HTTP_401_UNAUTHORIZED)
            new_comment = Comment(content=content, is_author_seeker=is_author_seeker, seeker=application.seeker, shelter=application.petlisting.owner, is_review=is_review, application=application)
            new_comment.save()
            return Response({'data': 'Comment Created'}, status=status.HTTP_200_OK)
        except:
            return Response({'data': 'Application does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            seeker = User.objects.get(email=seeker_email)
            shelter = User.objects.get(email=shelter_email)
            rating = request.data.get('rating')
            new_comment = Comment(content=content, is_author_seeker=is_author_seeker, seeker=seeker, shelter=shelter, is_review=is_review, rating=rating)
            new_comment.save()
            return Response({'data': 'Review Created'}, status=status.HTTP_200_OK)
        except:
            return Response({'data': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)


'''
VIEW A Comment
ENDPOINT: /api/comments/<int:msg_id>
METHOD: GET
PERMISSION: User logged in and must be the author or recipient of the comment
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comment_detail_view(request, msg_id):
    if request.user != comment.seeker and request.user != comment.shelter:
        return Response({'data': 'User not authorized to view this comment'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        comment = Comment.objects.get(pk=msg_id)
        data = {
            "id": comment.pk,
            "content": comment.content,
            "created_time": comment.created_time,
            "rating": comment.rating,
            "is_author_seeker": comment.is_author_seeker,
            "seeker": comment.seeker.email,
            "shelter": comment.shelter.email,
            "is_review": comment.is_review,
            "application": comment.application.pk,
        }
        return Response({'data': data}, status=status.HTTP_200_OK)
    except:
        return Response({'data': 'Comment does not exist'}, status=status.HTTP_400_BAD_REQUEST)

'''
LIST All Comments of a User's All Applications
ENDPOINT: /api/comments/applications
METHOD: GET
PERMISSION: User logged in
FE: Message Center
Returns in form:
{application_id: [comments], application_id: [comments], ...}
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comments_all_applications_list_view(request):
    try:
        if request.user.role == 'SHELTER':
            user_applications = User.objects.get(pk=request.user.pk).shelter_applications.all()
        else:
            user_applications = User.objects.get(pk=request.user.pk).seeker_applications.all()
        data = {}
        for application in user_applications:
            data[application.pk] = []
            comments = application.comment_set.all()
            for comment in comments:
                data[application.pk].append({
                    "id": comment.pk,
                    "content": comment.content,
                    "created_time": comment.created_time,
                    "rating": comment.rating,
                    "is_author_seeker": comment.is_author_seeker,
                    "seeker": comment.seeker.email,
                    "shelter": comment.shelter.email,
                    "is_review": comment.is_review,
                    "application": comment.application.pk,
                })
        return Response({'data': data}, status=status.HTTP_200_OK)
    except:
        return Response({'data': 'Error'}, status=status.HTTP_400_BAD_REQUEST)

'''
LIST All Comments of a Certain Application
ENDPOINT: /api/comments/applications/<int:app_id>
METHOD: GET
PERMISSION: User logged in and must be part of the application
FE: Message History with Shelter, Convo Name: Application
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comments_application_list_view(request, app_id):
    try:
        application = Application.objects.get(pk=app_id)
        data = []
        comments = application.comment_set.all()
        for comment in comments:
            data.append({
                "id": comment.pk,
                "content": comment.content,
                "created_time": comment.created_time,
                "rating": comment.rating,
                "is_author_seeker": comment.is_author_seeker,
                "seeker": comment.seeker.email,
                "shelter": comment.shelter.email,
                "is_review": comment.is_review,
                "application": comment.application.pk,
            })
        return Response({'data': data}, status=status.HTTP_200_OK)
    except:
        return Response({'data': 'Application does not exist'}, status=status.HTTP_400_BAD_REQUEST)

'''
LIST All Comments of a Shelter
ENDPOINT: /api/comments/shelter/<int:shelter_id>
METHOD: GET
PERMISSION: User logged in
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comments_shelter_list_view(request, shelter_id):
    try:
        shelter = User.objects.get(pk=shelter_id)
        if shelter.role != 'SHELTER':
            return Response({'data': 'Shelter does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        comments = Comment.objects.filter(shelter=shelter, is_review=True)
        data = []
        for comment in comments:
            data.append({
                "id": comment.pk,
                "content": comment.content,
                "created_time": comment.created_time,
                "rating": comment.rating,
                "is_author_seeker": comment.is_author_seeker,
                "seeker": comment.seeker.email,
                "shelter": comment.shelter.email,
                "is_review": comment.is_review,
                "application": comment.application.pk,
            })
        return Response({'data': data}, status=status.HTTP_200_OK)
    except:
        return Response({'data': 'Error'}, status=status.HTTP_400_BAD_REQUEST)