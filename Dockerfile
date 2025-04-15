# Dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install -g @angular/cli
RUN rm -rf node_modules package-lock.json && npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
