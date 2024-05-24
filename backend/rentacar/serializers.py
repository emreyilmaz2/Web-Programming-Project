from rest_framework import serializers
from .models import User, Rental

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def create(self, validated_data):
        # Kullanıcı oluşturma
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])  # Şifreyi güvenli bir şekilde hash'ler
        user.save()
        return user

    def update(self, instance, validated_data):
        # Kullanıcı bilgilerini güncelleme
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        password = validated_data.get('password')
        if password:
            instance.set_password(password)  # Şifreyi güvenli bir şekilde hash'ler
        instance.save()
        return instance

class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = ['id', 'car', 'start_date', 'end_date', 'total_cost']