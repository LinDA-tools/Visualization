FROM nodesource/wheezy:0.12
MAINTAINER Klaudia Thellmann

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
ENV VISBACKEND_EP=http://store:8890/sparql

EXPOSE 3002

CMD ["node", "visualization_backend.js"]

