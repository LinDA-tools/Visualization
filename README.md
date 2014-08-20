Prerequisites
=============

- Nodejs
- Git
- Virtuoso
- MongoDB

Installation under Ubuntu (12.04)
=======================================

Install Nodejs
```sh
- sudo apt-get update
- sudo apt-get install nodejs
- sudo apt-get install npm
- npm install -g nodemon
```
Install Git
```sh
- sudo apt-get install git-core
```
Install Virtuoso
```sh
- sudo apt-get install virtuoso-opensource
```
For further details on how to configure the virtuoso.ini please see the [virtuoso setup guide](http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/VOSUbuntuNotes)  

Install MongoDB 
```sh
- sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
- echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
- sudo apt-get update
- sudo apt-get install mongodb-org
- mongo
```

Install LinDA visualization
```sh
- git clone https://github.com/LinDA-tools/visualisation.git
- cd visualisation/frontend
- npm install 
- bower install
- cd visualisation/backend
- npm install
```

Start the application
```sh
- nodemon
- mongo
- sudo service virtuoso-opensource-6.1 start
- grunt serve
```
