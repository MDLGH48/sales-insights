FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7
RUN mkdir /dtapp
WORKDIR /dtapp

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .