FROM node:alpine

LABEL authors="Valdas Mazrimas <valdas.mazrimas@gmail.com>"
WORKDIR /srv/auth

COPY package*.json ./
RUN npm install --only=production

COPY ./src ./src
COPY ./wait-for-mysql.sh ./

RUN chmod +x ./wait-for-mysql.sh

CMD [ "npm", "start" ]