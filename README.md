Description
=============

The increasing number of publicly available datasets poses a challenge regarding the integration and consumption of information. The aim of the [LinDA project](http://linda-project.eu/) is to make the benefits of Linked Open Data accessible to SMEs and data providers by providing libraries for Open Data consumption.

One of the main tasks in this context is to build an ecosystem of tools for visualising Linked Data to assist SMEs in their daily tasks by hiding complexity through automation and an intuitive user interface.

To complete this task, a generic visualisation workflow is being implemented based on state-of-the-art Linked Data visualisation approaches.

Installation
=============

Prerequisites
------------------------------------------------------------------
- Git
- Nodejs
- Virtuoso

Installation steps (Ubuntu v. 12.04)
------------------------------------------------------------------

**Install Nodejs:**
```sh
- sudo apt-get update
- sudo apt-get install nodejs
- sudo apt-get install npm
- npm install -g nodemon
```

**Install Git:**
```sh
- sudo apt-get install git-core
```

**Install Virtuoso:**
```sh
- sudo apt-get install virtuoso-opensource
```
For further details on how to configure the `virtuoso.ini` please see the [virtuoso setup guide](http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/VOSUbuntuNotes).

**Install LinDA visualization:**
```sh
- git clone https://github.com/LinDA-tools/visualisation.git
- cd visualisation/frontend
- npm install
- bower install
- cd ../backend
- npm install
```

**Start the application:**
```sh
- nodemon &
- sudo service virtuoso-opensource-6.1 start
- cd visualisation/frontend
- grunt serve
```

**DEMO SETUP:**
- Upload RDF datasets from `Visualization/backend/testsets` into Virtuoso:
```sh
- Login into Virtuoso Conductor web interface (e.g. http://localhost:8890).
- Select the tab "Linked Data" and then "Quad Store Upload"
- For each RDF dataset enter the following graph IRIs:

  UC2_Newspaper-Articles-Analysis: http://newspaper.org/articles_2007

  UC3_Water-Quality-Analysis: http://water_quality_check.it/info

  UC4_a_Healthcare-Analysis: http://www.hospitals_reviewer.com/2014
```
- Upload into Virtuoso the dataset_metadata.ttl with the following URI: http://www.linda-project.org/dataset_metadata

**TODO**
- Finish implementation of visualization recommendation algorithm 
- Integrate visualization libraries for graph visualizations
