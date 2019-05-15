# Build App
FROM node:alpine as node

LABEL authors="Valdas Mazrimas <valdas.mazrimas@gmail.com>"

RUN apk add --update git && \
  rm -rf /tmp/* /var/cache/apk/*

WORKDIR /app

COPY ./src /app/src
COPY ./public /app/public
COPY ./package.json /app/
COPY ./yarn.lock /app/

RUN npm install

ARG REACT_APP_API_URI
ENV REACT_APP_API_URI ${REACT_APP_API_URI}

RUN npm run build

# Setup Reverse Proxy
FROM nginx:1.12

RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]