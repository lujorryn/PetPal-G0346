from django.urls import path

from .views import seekers_list_view, seeker_detail_view

app_name = 'seekers'

urlpatterns = [
    path('', seekers_list_view, name='seekers-lists'),
    path('/<int:account_id>', seeker_detail_view, name='seeker-detail'),
]