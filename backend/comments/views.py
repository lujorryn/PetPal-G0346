# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.core.paginator import Paginator
from applications.models import Application
from .models import Comment
from accounts.models import PetPalUser as User

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
    is_author_seeker = True if request.user.role == User.Role.SEEKER else False
    is_review = request.data.get('is_review')
    content = request.data.get('content')
    email=request.data.get('recipient_email')
    
    # Validate required payload
    missing_fields = []
    if is_review==None: missing_fields.append("is_review")
    if not content or content.strip()=="": missing_fields.append("content")
    if not email or email.strip()=="": missing_fields.append("recipient_email")
    if len(missing_fields) > 0:
        return Response({'error': f'Missing fields: {[field for field in missing_fields]} required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if str(is_review).lower() != 'true' and str(is_review).lower() != 'false':
        return Response({'error': 'is_review must be true or false'}, status=status.HTTP_400_BAD_REQUEST)
    
    if request.data.get('recipient_email') == None or request.data.get('recipient_email').strip() == '':
        return Response({'error': 'Recipient email cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Recipient does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if email is seeker -> shelter, shelter -> seeker
    if request.user.role == User.objects.get(email=email).role:
        return Response({'error': f'{request.user.role}-{request.user.role} communication not supported'}, status=status.HTTP_400_BAD_REQUEST)
    
    if is_author_seeker:
        seeker_email = request.user.email
        shelter_email = request.data.get('recipient_email')
    else:
        shelter_email = request.user.email
        seeker_email = request.data.get('recipient_email')
    
    if is_review == False:
        # Application message
        application_id = request.data.get('application_id')
        try:
            application = Application.objects.get(pk=application_id)
            # Check if user is part of the application
            if request.user != application.seeker and request.user != application.petlisting.owner:
                return Response({'error': 'User not authorized to comment on this application'}, status=status.HTTP_401_UNAUTHORIZED)
            if shelter_email != application.petlisting.owner.email:
                return Response({'error': 'Shelter does not own this petlisting'}, status=status.HTTP_400_BAD_REQUEST)
            new_comment = Comment(content=content, is_author_seeker=is_author_seeker, seeker=application.seeker, shelter=application.petlisting.owner, is_review=is_review, application=application)
            new_comment.save()
            # Update application last_updated
            application.last_updated = new_comment.created_time
            application.save()
            data = {
                "To": new_comment.seeker.email if new_comment.is_author_seeker else new_comment.shelter.email,
                "From": new_comment.shelter.email if new_comment.is_author_seeker else new_comment.seeker.email,
                "Message": new_comment.content,
                "application": new_comment.application.pk
            }
            return Response({'msg': 'Comment created', 'data': data}, status=status.HTTP_200_OK)
        except Exception as e: 
            # might also fail at save(), not necessarily "comment doesn't exist"
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Shelter comment
        try:
            seeker = User.objects.get(email=seeker_email)
            shelter = User.objects.get(email=shelter_email)
            rating = request.data.get('rating', None)
            if (rating == None or int(rating) < 1 or int(rating) > 5):
                if (request.user.role == User.Role.SEEKER):
                    # Seeker rating shelter, shelter reply can have no rating
                    return Response({'error': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
            # Check if user is already reviewed
            if (Comment.objects.filter(is_review=True, seeker=seeker, shelter=shelter).exists() and request.user.role == User.Role.SEEKER):
                return Response({'error': 'User already reviewed'}, status=status.HTTP_400_BAD_REQUEST)
            new_comment = Comment(content=content, is_author_seeker=is_author_seeker, seeker=seeker, shelter=shelter, is_review=is_review, rating=rating)
            new_comment.save()
            data = {
                "To": new_comment.seeker.email if new_comment.is_author_seeker else new_comment.shelter.email,
                "From": new_comment.shelter.email if new_comment.is_author_seeker else new_comment.seeker.email,
                "Message": new_comment.content,
                "rating": new_comment.rating
            }
            return Response({'msg': 'Review created', 'data': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

'''
VIEW A Comment
ENDPOINT: /api/comments/<int:msg_id>
METHOD: GET
PERMISSION: User logged in and must be the author or recipient of the comment
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comment_detail_view(request, msg_id):
    try:
        comment = Comment.objects.get(pk=msg_id)
        if request.user != comment.seeker and request.user != comment.shelter:
            return Response({'error': 'User not authorized to view this comment'}, status=status.HTTP_401_UNAUTHORIZED)
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
        return Response({'error': 'Comment does not exist'}, status=status.HTTP_400_BAD_REQUEST)

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

        # Visualization: Message center with a message preview so paginating user_applications not comments
        paginator = Paginator(user_applications, per_page=1)
        page_number = request.GET.get("page", 1)
        page_obj = paginator.get_page(page_number)
        
        for application in page_obj.object_list:
            
            data[application.pk] = []
            comments = application.comment_set.all().order_by('-created_time')
        
            # for comment in comments[:2]: # fixed length preview pagination, use for P3
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

        payload = {
            "page": {
                "current": page_obj.number,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
            },
            "data": data
        }
        
        return Response(payload, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        if request.user != application.seeker and request.user != application.shelter:
            return Response({'error': 'User not authorized to view this comment list'}, status=status.HTTP_401_UNAUTHORIZED)

        data = []
        comments = application.comment_set.all().order_by('-created_time')

        # pagination
        paginator = Paginator(comments, per_page=2)
        page_number = request.GET.get("page", 1)
        page_obj = paginator.get_page(page_number)

        for comment in page_obj.object_list:
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

        payload = {
            "page": {
                "current": page_obj.number,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
            },
            "data": data
        }
        
        return Response(payload, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Application does not exist'}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response({'error': 'Shelter does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        
        comments = Comment.objects.filter(shelter=shelter, is_review=True, rating__isnull=False).order_by('-created_time')
        data = []

        # pagination
        paginator = Paginator(comments, per_page=10)
        page_number = request.GET.get("page", 1)
        page_obj = paginator.get_page(page_number)

        # for comment in page_obj.object_list:
        for comment in page_obj:
            temp = {
                "id": comment.pk,
                "content": comment.content,
                "created_time": comment.created_time,
                "rating": comment.rating,
                "is_author_seeker": comment.is_author_seeker,
                "seeker": comment.seeker.email,
                "shelter": comment.shelter.email,
                "is_review": comment.is_review,
                "application": comment.application,
            }
            # Get shelter reply if exists
            try:
                shelter = User.objects.get(email=temp['shelter'])
                reply = shelter.shelter_comments.get(is_review=True, shelter=shelter, seeker=comment.seeker, is_author_seeker=False)
                temp['reply'] = {
                    "id": reply.pk,
                    "content": reply.content,
                    "created_time": reply.created_time,
                    "rating": reply.rating,
                    "is_author_seeker": reply.is_author_seeker,
                    "seeker": reply.seeker.email,
                    "shelter": reply.shelter.email,
                    "is_review": reply.is_review,
                    "application": reply.application,
                }
            except:
                temp['reply'] = None
            data.append(temp)

        payload = {
            "page": {
                "current": page_obj.number,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
            },
            "data": data
        }

        return Response(payload, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'Shelter does not exist'}, status=status.HTTP_400_BAD_REQUEST)