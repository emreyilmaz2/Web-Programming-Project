from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer, RentalSerializer
from .models import User, Vehicle, Rental
from django.contrib.auth import authenticate, login, logout
import bcrypt
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes



def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
def check_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    # Django'nun authenticate fonksiyonuyla kullanıcıyı doğrulama
    user = authenticate(request, username=email, password=password)
    if user is not None:
        login(request, user)  # Kullanıcıyı oturum açma
        user.is_logged_in = True
        user.save()
        tokens = get_tokens_for_user(user)
        return Response(tokens, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def logout_view(request):
    # Implement logout logic here
    user = request.user
    user.is_logged_in = False
    user.save()
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def available_vehicles(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    vehicles = Vehicle.objects.filter(is_available=True)
    data = [{'id': v.id, 'brand': v.brand, 'model': v.model, 'year': v.year } for v in vehicles]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
def rent_vehicle(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    vehicle_id = request.data.get('vehicle_id')
    vehicle = Vehicle.objects.filter(id=vehicle_id, is_available=True).first()
    if not vehicle:
        return Response({'error': 'Vehicle not available or does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    # Kiralama başlangıç ve bitiş tarihlerini alın
    start_date = datetime.strptime(request.data.get('start_date'), '%Y-%m-%d')
    end_date = datetime.strptime(request.data.get('end_date'), '%Y-%m-%d')
    rental_days = (end_date - start_date).days
    daily_rental_rate = 100  # Bu değeri Vehicle modelinizden uygun bir alandan almalısınız.
    total_cost = rental_days * daily_rental_rate
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    rental = Rental(
        car=vehicle,
        customer=user,
        start_date=start_date,
        end_date=end_date,
        total_cost=total_cost  # Bu, hesaplama yapılabilir bir alana bağlı olarak ayarlanmalıdır.
    )
    vehicle.is_available = False
    rental.save()
    vehicle.save()
    return Response({'message': 'Vehicle rented successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def return_vehicle(request, vehicle_id):
    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
        # Kiralama kaydını bul ve güncelle
        rental = Rental.objects.filter(car=vehicle, end_date__gt=timezone.now()).last()
        if rental:
            rental.end_date = timezone.now()  # Kiralama süresini güncelle
            rental.save()
            vehicle.is_available = True  # Aracı müsait olarak işaretle
            vehicle.save()
            return Response({'message': 'Vehicle returned and now available'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No active rental found for this vehicle'}, status=status.HTTP_404_NOT_FOUND)
    except Vehicle.DoesNotExist:
        return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def rented_vehicles(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    rentals = Rental.objects.filter(customer=request.user)
    serializer = RentalSerializer(rentals, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)