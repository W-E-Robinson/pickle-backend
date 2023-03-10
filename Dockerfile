FROM alpine

ENV BACKEND_PORT=${BACKEND_PORT}
ENV DB_PORT=${DB_PORT}
ENV DB_FORWARDING_PORT=${DB_FORWARDING_PORT}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_DATABASE=${DB_DATABASE}

RUN apk add --update nodejs npm

WORKDIR /app

COPY ./package* .

COPY ./src .

RUN npm i

EXPOSE ${BACKEND_PORT}

ENTRYPOINt [ "npm", "run", "docker-dev-no-check" ]
