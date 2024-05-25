# Base image olarak resmi Python imajını kullan
FROM python:3.9-slim

# Çalışma dizinini ayarla
WORKDIR /usr/src/app

# Gereksinim dosyasını kopyala ve gerekli bağımlılıkları yükle
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama dosyalarını kopyala
COPY . .

# Django uygulamasını başlat
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


