from django.urls import path

from .views import blogpost_create_view, blogpost_list_view, blogpost_detail_view

app_name = 'blogpost'

urlpatterns = [
    path('', blogpost_create_view, name='blogpost-create'),
    path('/shelter/<int:shelter_id>', blogpost_list_view, name='blogpost-list'),
    path('/<int:blog_id>', blogpost_detail_view, name='blogpost-detail')
]
