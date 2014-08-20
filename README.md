Requirements
=============

- Nodejs & Nodemon
- Git
- Virtuoso
- MongoDB
- Webserver e.g. Apache2
- Linux e.g. Ubuntu 

Installation
=============

1. Install Nodejs
```sh
> sudo apt-get update
> sudo apt-get install nodejs
> sudo apt-get install npm
> npm install -g nodemon
> nodemon
```
2. Install & configure apache2 
```sh
- sudo apt-get install apache2 
- cd /etc/apache2/sites-available 
- sudo nano default
    <Directory /var/www/>
                    Options All 
                    AllowOverride All 
                    Order allow,deny
                    allow from all
    </Directory>
- sudo service apache2 restart
```

3. Install & configure Virtuoso
```sh
- sudo apt-get install virtuoso-opensource
For further details on how to configure virtuoso.ini please visit http://virtuoso.openlinksw.com/dataspace/doc/dav/wiki/Main/VOSUbuntuNotes
- sudo service virtuoso-opensource-6.1 start
```

4. Install & configure MongoDB 
```sh
- sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
- echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
- sudo apt-get update
- sudo apt-get install mongodb-org
```

5. Install LinDA visualization
```sh
- git clone https://github.com/LinDA-tools/visualisation.git
- cd visualisation/frontend
- npm install 
- bower install
- cd visualisation/backend
- npm install
```

