# Build App
FROM node:alpine as node

LABEL authors="Valdas Mazrimas <valdas.mazrimas@gmail.com>"

RUN apk add --update git && \
  rm -rf /tmp/* /var/cache/apk/*

WORKDIR /app
COPY package*.json /app/

RUN npm install
COPY ./ /app/

ARG REACT_APP_API_URI
ENV REACT_APP_API_URI ${REACT_APP_API_URI}

RUN npm run build

# Setup Reverse Proxy
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/build/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]