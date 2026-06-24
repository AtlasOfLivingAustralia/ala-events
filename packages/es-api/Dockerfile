FROM node:24.16.0-alpine
WORKDIR /usr/src/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4001
CMD [ "node", "src/index.js" ]