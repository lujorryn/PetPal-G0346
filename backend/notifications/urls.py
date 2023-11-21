from django.urls import path

from .views import notifications_list_view, notifications_detail_view

app_name = 'notifications'

urlpatterns = [
    path('', notifications_list_view, name='note-list'),
    path('/<int:note_id>', notifications_detail_view, name='note-detail'),
]