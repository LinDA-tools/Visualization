FROM encoflife/virtuoso:7.1.0
MAINTAINER Klaudia Thellmann
COPY ./datasets /data/datasets
COPY ./visualization_ontology /data/visualization_ontology
WORKDIR /data

RUN \
  /usr/local/bin/virtuoso-t +wait -c /usr/local/var/lib/virtuoso/db/virtuoso.ini && \
  isql localhost dba dba /data/visualization_ontology/load_ontology.isql && \
  isql localhost dba dba /data/datasets/load_datasets.isql && \
  isql localhost dba dba exec="SHUTDOWN;"

EXPOSE 8890 1111
CMD  /usr/local/bin/virtuoso-t -f -c /usr/local/var/lib/virtuoso/db/virtuoso.ini
