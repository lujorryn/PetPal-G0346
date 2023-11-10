from django.urls import path

from .views import seekers_list_view, seeker_detail_view, seeker_favorites_view, seeker_favorites_edit_view

app_name = 'seekers'

urlpatterns = [
    path('', seekers_list_view, name='seekers-lists'),
    path('/<int:account_id>', seeker_detail_view, name='seeker-detail'),
    path('/<int:account_id>/favorites', seeker_favorites_view, name='seeker-favorites'),
    path('<int:account_id>/favorites/<int:pet_id>', seeker_favorites_edit_view, name='seeker-favorites-edit'),
]