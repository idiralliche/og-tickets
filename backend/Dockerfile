# syntax=docker/dockerfile:1.4

# Stage 1: Build stage
FROM python:3.12-slim AS builder
WORKDIR /app

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency file and install packages
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . .

# Set environment variables for the build stage
ARG ENV=prod
ARG DEBUG=False

ENV ENV=${ENV}
ENV DEBUG=${DEBUG}

# Run collectstatic to gather static files (ensure production settings are set)
# collectstatic requires SECRET_KEY to be set
# use a secret file mounted as a volume for SECRET_KEY
RUN --mount=type=secret,id=secret_key,dst=/run/secrets/secret_key \
    sh -c "export SECRET_KEY=$(cat /run/secrets/secret_key) && python manage.py collectstatic --noinput"

# Stage 2: Final image
FROM python:3.12-slim
WORKDIR /app

# Install netcat for health checks
RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN adduser --disabled-password --gecos '' appuser

# Copy installed packages and project code from builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

# Copy entrypoint script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Switch to non-root user
RUN chown -R appuser:appuser /app
USER appuser

# Expose the application port
EXPOSE 8000

# Start the application using gunicorn
CMD ["sh", "/start.sh"]
