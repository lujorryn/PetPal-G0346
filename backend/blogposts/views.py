# from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from accounts.models import PetPalUser as User
from .models import BlogPost
from .serializers import BlogPostSerializer, BlogPostUpdateSerializer

# Create your views here.
'''
CREATE New blogpost
ENDPOINT: /api/blogposts
METHOD: POST
PERMISSION: User logged in and is a shelter
SUCCESS:
'''
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def blogpost_create_view(request):
    if request.method == 'POST':
        if request.user.role != User.Role.SHELTER:
            return Response({'error': 'User not authorized to create blog post'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = BlogPostSerializer(data=request.data)
        if serializer.is_valid():
            try:
                blogpost = serializer.save(author=request.user)
                return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

'''
LIST All blogposts of a shelter
ENDPOINT: /api/blogposts/shelter/<int:shelter_id>
METHOD: GET
PERMISSION: User logged in
SUCCESS:
'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def blogpost_list_view(request, shelter_id):
    if request.method == 'GET':
        blogposts = BlogPost.objects.filter(author=User.objects.get(pk=shelter_id))
        
        data = []
        paginator = PageNumberPagination()
        paginator.page_size = 2
        paginated_blogposts = paginator.paginate_queryset(blogposts, request)

        for blogpost in paginated_blogposts:
            result = {
                'id': blogpost.pk,
                'title': blogpost.title,
                'content': blogpost.content,
                'created_time': blogpost.created_time,
                'last_updated': blogpost.last_updated,
                'image': blogpost.image.url if blogpost.image else '',
                'author': blogpost.author.first_name
            }
            data.append(result)

        return paginator.get_paginated_response({'data': data})

'''
VIEW / EDIT / DELETE A blogpost
ENDPOINT: /api/blogposts/<int:blog_id>
METHOD: GET, PATCH, DELETE
PERMISSION: 
GET: User logged in
PUT/DELETE: User logged in and is the owner of the blogpost
SUCCESS:
'''
@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def blogpost_detail_view(request, blog_id):            
    if request.method == 'GET':
        try:
            blogpost = BlogPost.objects.get(pk=blog_id)
            data = {
                'id': blogpost.pk,
                'title': blogpost.title,
                'content': blogpost.content,
                'created_time': blogpost.created_time,
                'last_updated': blogpost.last_updated,
                'image': blogpost.image.url if blogpost.image else '',
                'author': blogpost.author.first_name
            }
            return Response({'data': data}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Blog post does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'PATCH':
        try:
            blogpost = BlogPost.objects.get(pk=blog_id)
            if request.user != blogpost.author:
                return Response({'error': 'User not authorized to edit this blog post'}, status=status.HTTP_401_UNAUTHORIZED)
            serializer = BlogPostUpdateSerializer(instance=BlogPost.objects.get(pk=blog_id), data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({'data': serializer.data}, status=status.HTTP_200_OK)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Blog post does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'DELETE':
        try:
            blogpost = BlogPost.objects.get(pk=blog_id)
            if request.user != blogpost.author:
                return Response({'error': 'User not authorized to delete this blog post'}, status=status.HTTP_401_UNAUTHORIZED) 
            blogpost.delete()
            return Response({'msg': 'Blog post deleted'}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Blog post does not exist'}, status=status.HTTP_400_BAD_REQUEST)