from django.urls import path

from .views import shelters_list_view, shelter_detail_view

app_name = 'shelters'

urlpatterns = [
    path('', shelters_list_view, name='shelter-list'),
    path('/<str:account_id>', shelter_detail_view, name='shelter-detail'),
]