FROM python:3.9-slim

WORKDIR /app

# The 'slim' image has better support for pre-compiled wheels, reducing the need for build tools.
# However, including build-essential is a good practice in case a package needs to be compiled.
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]