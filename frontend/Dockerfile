FROM nodesource/wheezy:0.12
MAINTAINER Klaudia Thellmann

ENV DATASETS_ENDPOINT=http://store:8890/sparql
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN echo '{ "datasetsEndpoint": "${DATASETS_ENDPOINT}" }' > app/config.json && \
    useradd -r -m grunt && \
    usermod -L grunt && \
    chown -R grunt /usr/src/app && \
    su grunt -c "cd /usr/src/app && npm install" && \
    npm install -g grunt-cli bower && \
    su grunt -c "cd /usr/src/app && bower install"

EXPOSE 9001

CMD ["su", "grunt", "-c", "grunt serve"]

