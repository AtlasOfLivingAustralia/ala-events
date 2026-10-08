# Build stage
FROM node:24.21.0-alpine AS build
WORKDIR /usr/src/
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:24.21.0-alpine
WORKDIR /usr/src/
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /usr/src/dist ./dist
COPY public ./public
EXPOSE 4000
CMD ["node", "dist/index.js"]
