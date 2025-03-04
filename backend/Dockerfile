# Stage 1: Build stage
FROM python:3.12-slim AS builder
WORKDIR /app

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency file and install packages
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . .

# Set production environment variables for the build stage
# This avoids loading .env file and allows running collectstatic
ENV ENV=prod
ENV SECRET_KEY=dummysecretkey
ENV DEBUG=False

# Run collectstatic to gather static files (ensure production settings are set)
RUN python manage.py collectstatic --noinput

# Stage 2: Final image
FROM python:3.12-slim
WORKDIR /app

# Create a non-root user for security
RUN adduser --disabled-password --gecos '' appuser

# Copy installed packages from builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the application code (only necessary files)
COPY --from=builder /app /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8000

# Start the application using gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "ogtickets.wsgi:application"]
