FROM python:3.9

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

EXPOSE 8000

CMD ["sh", "-c", "/usr/src/app/wait-for-it.sh db:5432 -- python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
