from django.contrib import admin
from .models import User, Vehicle, Rental

# Register your models here.
admin.site.register(User)
admin.site.register(Vehicle)
admin.site.register(Rental)
