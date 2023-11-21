from django.urls import path

from .views import applications_list_and_create_view, pet_applications_list_view, application_detail_view

app_name = 'applications'

urlpatterns = [
    path('', applications_list_and_create_view, name='applications-lists'),
    path('/pet/<int:pet_id>', pet_applications_list_view, name='pet-applications-lists'),
    path('/<int:app_id>', application_detail_view, name='applications-detail'),
]