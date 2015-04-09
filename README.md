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
- Triplestore (for example Virtuoso)
- Compass (Ruby)

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

**RUBY and COMPASS Versions**

Please make sure you are using Ruby 2 and Compass 0.12.3

Unwanted old Ruby installations may cause problems:
```sh
- ruby -v
- compass -v
- which compass
- which ruby
```

Remove them:
```sh
- sudo apt-get remove ruby_version
```

Install Ruby Version Manager rvm:
```sh
- rvm install 2.0.0
- rvm use 2.0.0 (as root/sudo)
```

Then install Compass: 
```sh
- gem install compass --version="0.12.3"
```

**DEMO SETUP:**
- Upload RDF datasets from `Visualization/backend/testsets` into Virtuoso
- Upload the visualization ontology from `Visualization/backend/visualization_ontology` into Virtuoso (URI: http://linda-project.eu/linda-visualization)


