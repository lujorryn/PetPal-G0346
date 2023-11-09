from django.urls import path

from .views import petlistings_list_and_create_view, petlistings_category_list_view, petlisting_detail_view

app_name = 'petlistings'

urlpatterns = [
    path('', petlistings_list_and_create_view, name='petlisting-lists'),
    path('/category/<str:category>', petlistings_category_list_view, name='petlisting-category-lists'),
    path('/<int:pet_id>', petlisting_detail_view, name='pelisting-detail'),
]