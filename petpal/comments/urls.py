from django.urls import path

from .views import (
    comment_create_view, comment_detail_view, 
    comments_all_applications_list_view, comments_application_list_view,
    comments_shelter_list_view
)

app_name = 'comments'

urlpatterns = [
    path('', comment_create_view, name='comment-create'),
    path('/applications', comments_all_applications_list_view, name='comments-all-applications'),
    path('/applications/<str:app_id>', comments_application_list_view, name='comments-application'),
    path('/<str:msg_id>', comment_detail_view, name='comment-detail'),
    path('/shelter/<str:shelter_id>', comments_shelter_list_view, name='comments-shelter'),
]