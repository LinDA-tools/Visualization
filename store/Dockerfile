FROM encoflife/virtuoso:7.1.0
MAINTAINER Klaudia Thellmann
COPY ./datasets /datasets
WORKDIR /datasets

RUN \
  /usr/local/bin/virtuoso-t +wait -c /usr/local/var/lib/virtuoso/db/virtuoso.ini && \
  isql localhost dba dba /datasets/load_datasets.isql && \
  isql localhost dba dba exec="SHUTDOWN;"

EXPOSE 8890 1111
CMD  /usr/local/bin/virtuoso-t -f -c /usr/local/var/lib/virtuoso/db/virtuoso.ini
