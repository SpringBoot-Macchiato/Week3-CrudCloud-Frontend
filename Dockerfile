# ----------------------------------------------------
# STAGE 1: Build (para generar los archivos estáticos)
# ----------------------------------------------------
FROM node:20 as builder

# Directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package.json ./

# Instala las dependencias
RUN npm install

# Copia el código fuente y genera el build de producción
COPY . .
RUN npm run build

# ----------------------------------------------------
# STAGE 2: Producción (solo para servir la build)
# ----------------------------------------------------
# Usa una imagen base más ligera (Alpine)
FROM node:20-alpine

# Instala 'serve' globalmente
RUN npm install -g serve

# Directorio de trabajo
WORKDIR /usr/src/app

# Copia la build generada del stage anterior
COPY --from=builder /app/dist /usr/src/app

# Puerto interno del contenedor (donde escucha 'serve')
EXPOSE 3000

# Comando para iniciar el servidor 'serve'
CMD ["serve", "-s", "-l", "tcp://0.0.0.0:3000"]