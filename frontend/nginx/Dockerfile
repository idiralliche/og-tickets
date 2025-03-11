FROM nginx:stable-alpine

# Copy the custom Nginx configuration into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]