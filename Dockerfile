# Etapa de construcción
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto del proyecto y construir
COPY . .
RUN npm run build
