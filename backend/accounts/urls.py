from django.urls import path

from .views import signup_view, LogoutView, account_delete_view

app_name = 'accounts'

urlpatterns = [
    path('/new-account', signup_view, name='account-signup'),
    path('/logout', LogoutView.as_view(), name='account-logout'),
    path('/<int:account_id>', account_delete_view, name='account-delete'),
]
