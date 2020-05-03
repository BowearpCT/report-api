FROM node:12.13.0-alpine
WORKDIR /app
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz
COPY package.json /app/package.json
RUN npm install nodemon -g
RUN npm install
CMD ["dockerize", "-wait", "tcp://mongo:27017", "npm", "start"]