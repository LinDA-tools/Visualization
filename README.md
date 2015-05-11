Description
=============

The increasing number of publicly available datasets poses a challenge regarding the integration and consumption of information.

The objective of the [LinDA project](http://linda-project.eu/) which involves a number of research and industry partners from different sectors is to make the benefits of LOD accessible to SMEs.

One of the major challenges of this project is to provide means for exploring and visualizing Linked Data by hiding complexity through automation and an intuitive user interface.

This is put into practice by an easy to use wizard-like tool, [LinkDaViz](http://eis.iai.uni-bonn.de/Projects/LinkDaViz/), that guides the user step by step through the process of browsing, selecting and exploring data and configuring visualizations by computing suggestions for suitable visualizations and possible configurations for this visualizations.


 
 



Installation
=============

Prerequisites
------------------------------------------------------------------
- Docker
- Docker Compose
- (Git)

Installation steps
------------------------------------------------------------------
**Install Docker and Docker Compose:**
Please follow the installation instructions on the [Docker website] (http://docs.docker.com/installation/)

**(Optional) Install Docker and Docker Compose:**

**Build and start the application:**
- 
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
