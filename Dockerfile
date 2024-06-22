FROM node:22-alpine as build

WORKDIR /app
COPY . /app/

# Prepare the container for building React
RUN npm install
# We want the production version
RUN npm run build

# Prepare nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/html
ENV NGINX_PORT=5000
EXPOSE 5000
# Fire up nginx

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh", "./entrypoint.sh"]
#CMD ["nginx", "-g", "daemon off;"]