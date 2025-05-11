# Usa una imagen base con Node.js
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos de configuración y el package.json al contenedor
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Instalar OpenSSL necesario para Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copiar el resto de los archivos del proyecto
COPY . .

# Establecer NODE_ENV a producción por defecto
ENV NODE_ENV=prod


# Copiar el archivo .env.prod y usarlo en el contenedor
COPY .env.prod .env

# Ejecutar prisma generate para generar los archivos de Prisma Client
RUN npx prisma generate

# Compilar el proyecto TypeScript
RUN npm run build

# Ejecutar migraciones de Prisma
RUN npx prisma migrate deploy

# Exponer el puerto que usa la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
