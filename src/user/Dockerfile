FROM node:alpine

LABEL authors="Valdas Mazrimas <valdas.mazrimas@gmail.com>"
WORKDIR /srv/api

COPY package*.json ./
RUN npm install --only=production

COPY ./src ./src
COPY ./wait-for-mysql.sh ./src/

RUN chmod +777 ./src/wait-for-mysql.sh

EXPOSE 30030

CMD [ "npm", "start" ]