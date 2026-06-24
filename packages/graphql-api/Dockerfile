FROM node:24.18.0-alpine
WORKDIR /usr/src/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]
