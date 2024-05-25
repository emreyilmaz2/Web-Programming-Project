#!/bin/sh

echo "Running initial setup..."

# Veritabanının başlatılmasını bekleyin
sleep 10

# Django migrate işlemini yapın
python manage.py migrate

# Python scriptini çalıştırarak veritabanına araç ekleyin
python /usr/src/app/add_vehicles.py

echo "Initial setup completed."

# Ana uygulamayı başlatın
exec "$@"
