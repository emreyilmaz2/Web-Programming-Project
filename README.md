# Araç Kiralama Web Sitesi

## Proje Özeti
Tasarladığımız Araç Kiralama sitesi, kullanıcıların kolayca araç kiralayabileceği modern bir platform sunmaktadır. UI Framework kullanılarak tasarlanan kullanıcı arayüzü, kullanıcıların araçları kolayca tarayıp rezervasyon yapmalarını sağlar. OOP prensiplerine dayalı iş katmanı, veri katmanında ORM ve migrations kullanarak veritabanı işlemlerini yönetir. Ayrıca, web servisleri ile farklı bileşenler arasında iletişim kurarken, yetkilendirme uygulaması kullanıcıların güvenliği ve gizliliği için entegre edilmiştir. Bu sayede, kullanıcılar güvenilir bir platformda araç kiralama işlemlerini rahatlıkla gerçekleştirebilirler.

## Teknolojiler
- **Presentation Layer**: Bootstrap ve React
- **Business Layer**: OOP Bileşenleri (Sınıflar, Metodlar, Arayüzler vb.)
- **Data Layer**: ORM ve Migrations
- **Web Service Implementation**: RESTful API
- **Authorization Implementation**: JWT

## Özellikler
1. **Presentation Layer: UI Framework Using Bootstrap + React**
2. **Business Layer: OOP Components**: Sınıflar, Metodlar, Arayüzler vb.
3. **Data Layer: ORM / Migrations**
4. **Web Service Implementation**: RESTFul
5. **Authorization Implementation**: JWT

## Contributors
| Özellik | Öğrenci No / Ad Soyad |
| --- | --- |
| Presentation Layer: UI Framework Using | 200201010 / Samet Bilek |
| Business Layer: OOP Components | 200201010 / Samet Bilek |
| Data Layer: ORM / Migrations Using | 200201010 / Samet Bilek |
| Web Service Implementation | 200201064 / Emre Yılmaz |
| Authorization Implementation | 200201064 / Emre Yılmaz |

## Kurulum ve Çalıştırma
Projeyi Docker ortamında çalıştırmak için aşağıdaki adımları izleyin:

1. **Depoyu Klonlayın**:
    ```bash
    git clone https://github.com/kullanici-adi/araç-kiralama.git
    cd araç-kiralama
    ```

2. **Docker ve Docker Compose Kurulumu**:
    Docker ve Docker Compose bilgisayarınızda kurulu değilse, resmi dokümantasyondan kurulum adımlarını takip edebilirsiniz.

3. **Docker Compose ile Projeyi Başlatın**:
    ```bash
    docker-compose up --build
    ```

4. **Web Sitesini Açın**:
    Tarayıcınızda `http://localhost:80` adresini açarak projeyi görüntüleyebilirsiniz.

## Docker Compose Dosyası
```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    ports:
      - "5433:5432"  # Map host port 5433 to container port 5432
    environment:
      POSTGRES_DB: rentacar_db
      POSTGRES_USER: user_web
      POSTGRES_PASSWORD: sifre123
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: ./backend
    command: sh -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
    volumes:
      - ./backend:/usr/src/app
    ports:
      - "8000:8000"
    depends_on:
      - db

  react-app:
    build:
      context: ./web_front
      dockerfile: Dockerfile
    ports:
      - "80:80"

volumes:
  postgres_data:
