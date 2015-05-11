### Description

The increasing number of publicly available datasets poses a challenge regarding the integration and consumption of information.

The objective of the [LinDA project](http://linda-project.eu/) which involves a number of research and industry partners from different sectors is to make the benefits of LOD accessible to SMEs.

One of the major challenges of this project is to provide means for exploring and visualizing Linked Data by hiding complexity through automation and an intuitive user interface.

This is put into practice by an easy to use wizard-like tool, [LinkDaViz](http://eis.iai.uni-bonn.de/Projects/LinkDaViz/), that guides the user step by step through the process of browsing, selecting and exploring data and configuring visualizations by computing suggestions for suitable visualizations and possible configurations for this visualizations.

![Data selection and visualization](https://www.dropbox.com/s/lofec1mnfbpent7/Visualization-Workflow-UI-res2.jpg?dl=1 "Data selection and visualization")

### Installation

#### Prerequisites:
- [Docker and Docker Compose](http://docs.docker.com/installation/)
- Optionally: [Git](http://git-scm.com/) 

#### Installation steps
- Install Docker and Docker Compose
- Optionally: Install Git and clone LinDAViz project 
- Go to the directory _LinDAVis_ and execute _docker-compose_ _up_

In order to start the application while re-using old containers execute from the _LinDAVis_ directory _docker-compose_ _start_. To start only one or two containers execute _docker-compose_ _start_ _store_ (for Virtuoso) or _docker-compose_ _start_ _backend_ (for Virtuoso and Backend). This might be useful for setting up the development environment without having to compile Virtuoso. To rebuild images execute _docker-compose_ _build_
To rebuild only one container execute _docker-compose_ _build_ _store_.
