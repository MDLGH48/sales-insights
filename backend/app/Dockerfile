FROM tiangolo/uvicorn-gunicorn:python3.7

COPY . .

RUN pip install -r requirements.txt

EXPOSE 80

CMD ["uvicorn", "main:app","--host", "0.0.0.0", "--port", "80"]