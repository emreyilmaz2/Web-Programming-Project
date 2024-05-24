from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_logged_in = models.BooleanField(default=False)  # Kullanıcı oturum durumu

    def __str__(self):
        return self.username


class Vehicle(models.Model):
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    is_available = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.brand} {self.model}"

class Rental(models.Model):
    car = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='rentals')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rentals')
    start_date = models.DateField()
    end_date = models.DateField()
    total_cost = models.DecimalField(max_digits=6, decimal_places=2)
    def __str__(self):
        return f"{self.customer} 🔑 {self.car} 📅 {self.start_date} - {self.end_date}"

