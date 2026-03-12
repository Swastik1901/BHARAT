# 1. Base image (Python 3.11 Slim is enough)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install minimal system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. CACHE MAGIC: Dependencies install it
COPY requirements.txt .
RUN pip install --no-cache-dir fastapi uvicorn pydantic


COPY main.py .

# Expose port
EXPOSE 8000

# Start FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]