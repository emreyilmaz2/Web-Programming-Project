#!/bin/sh

echo "Running initial setup..."

# Veritabanının başlatılmasını bekleyin
sleep 10

# Django migrate işlemini yapın
python manage.py migrate

# Python scriptini çalıştırarak veritabanına araç ekleyin
python /usr/src/app/add_vehicles.py

echo "Initial setup completed."

# Sunucuyu başlat
python manage.py runserver 0.0.0.0:8000

# Ana uygulamayı başlatın
exec "$@"
