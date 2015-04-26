Description
=============

The increasing number of publicly available datasets poses a challenge regarding the integration and consumption of information. The aim of the [LinDA project](http://linda-project.eu/) is to make the benefits of Linked Open Data accessible to SMEs and data providers by providing libraries for Open Data consumption.

One of the main tasks in this context is to build an ecosystem of tools for visualising Linked Data to assist SMEs in their daily tasks by hiding complexity through automation and an intuitive user interface.

To complete this task, a generic visualisation workflow is being implemented based on state-of-the-art Linked Data visualisation approaches.

Installation
=============

Prerequisites
------------------------------------------------------------------
- Docker
- Docker Compose

Installation steps
------------------------------------------------------------------
**Install Docker and Docker Compose:**


Please follow the installation instructions on the [Docker website] (http://docs.docker.com/installation/)


**Build and start the application:**
- cd LinDAVis
- docker-compose up

**If you want to start the application while re-using the old containers (preserving changed data etc.)**
- cd LinDAVis
- docker-compose start

**If you want to start only one or two of the containers**
- cd LinDAVis
- "docker-compose start store" (for Virtuoso) or "docker-compose start backend" (for Virtuoso and Backend)
This is useful for setting up the development environment without having to compile Virtuoso.

**If you want to rebuild the images**
- cd LinDAVis
- docker-compose build
or, if you want to rebuild only some:
- docker-compose build store
