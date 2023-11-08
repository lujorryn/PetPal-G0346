from django.urls import path

from .views import login_view, signup_view, logout_view, account_delete_view

app_name = 'accounts'

urlpatterns = [
    path('', login_view, name='login'),
    path('/new-account', signup_view, name='signup'),
    path('/logout', logout_view, name='account-logout'),
    path('/<str:account_id>', account_delete_view, name='account-delete'),
]
