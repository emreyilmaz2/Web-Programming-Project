FROM python:3.9
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh
COPY init.sh /usr/src/app/init.sh
RUN chmod +x /usr/src/app/init.sh
EXPOSE 8000
CMD ["sh", "-c", "/usr/src/app/wait-for-it.sh db:5432 -- sh /usr/src/app/init.sh && python manage.py runserver 0.0.0.0:8000"]
