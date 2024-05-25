import random
import os
import django

# Django ayarlarını başlatın
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rentacar_project.settings')  # Proje adını uygun şekilde güncelleyin
django.setup()

from rentacar.models import Vehicle  # Uygulamanızın adını ve modelinizi uygun şekilde güncelleyin

# Rastgele araç verileri oluşturun
brands = ['Audi', 'BMW', 'Cupra', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Mercedes', 'Opel', 'Renault', 'Tesla', 'Togg', 'Toyota', 'Volkswagen']
models = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible']

def add_random_vehicle():
    brand = random.choice(brands)
    model = random.choice(models)
    year = random.randint(2000, 2024)
    
    Vehicle.objects.create(
        brand=brand,
        model=model,
        year=year,
    )

# 20 adet rastgele araç ekleyin
for _ in range(20):
    add_random_vehicle()

print("20 random vehicles added to the database.")
