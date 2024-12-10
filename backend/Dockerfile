# Dockerfile
FROM node:18-alpine

WORKDIR /destination-app/backend

# Install system dependencies for db
RUN apk update && \
    apk add --no-cache openssl

# Install app dependencies
COPY package*.json ./
RUN npm install

#Generate Prisma Client
COPY prisma ./prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . .

RUN npm run build

EXPOSE 8080

# Start the application
CMD ["npm", "run","start"]

#Entrypoint?