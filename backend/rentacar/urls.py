from django.urls import path
from .views import register, login_view, logout_view, available_vehicles, rent_vehicle, return_vehicle, user_profile, rented_vehicles
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', user_profile, name='profile'),
    path('profile/update/', user_profile, name='profile'),
    path('vehicles/', available_vehicles, name='vehicles'),
    path('rent-vehicle/', rent_vehicle, name='rent-vehicle'),
    path('return-vehicle/<int:vehicle_id>/', return_vehicle, name='return-vehicle'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('rented_vehicles/', rented_vehicles, name='rented_vehicles'),

]