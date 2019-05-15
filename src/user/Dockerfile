FROM node:alpine

LABEL authors="Valdas Mazrimas <valdas.mazrimas@gmail.com>"
WORKDIR /srv/api

COPY package*.json ./
RUN npm install --only=production

COPY ./src ./src
COPY ./wait-for-mysql.sh ./src/

RUN useradd -u 1001 -r -g 0 -d ./src -s /sbin/nologin \
    -c "App User" default
RUN chmod 755 ./src/wait-for-mysql.sh

EXPOSE 30030

CMD [ "npm", "start" ]