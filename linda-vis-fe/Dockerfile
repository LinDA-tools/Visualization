FROM nodesource/wheezy:0.12
MAINTAINER Klaudia Thellmann

ENV DATASETS_ENDPOINT=http://store:8890/sparql NODE_ENV=development
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN apt-get update && \
    apt-get install -y git-core && \
    echo "{ \"datasetsEndpoint\": \"${DATASETS_ENDPOINT}\" }" > public/config.json && \
    useradd -r -m grunt && \
    usermod -L grunt && \
    chown -R grunt /usr/src/app && \
    npm install -g bower && \
    su grunt -c "cd /usr/src/app && npm install" && \
    su grunt -c "cd /usr/src/app && bower install && bower install bootswatch" && \
    apt-get clean

EXPOSE 4200

CMD ["su", "grunt", "-c", "/usr/src/app/node_modules/.bin/ember server"]
