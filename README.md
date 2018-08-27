# Zoox backend

> A node crud api proposed by Zoox.

## Requirements
- node v9.3.0
- mongodb v3.4.10

## Build Setup in Local

``` bash
# install dependencies
npm install
```

## Running in Local
``` bash
# change the file .env.example to .env
mv .env.example .env
# start mongodb service
sudo service mongod start
# serve with hot reload at localhost:3000
npm run start
```

## Running in a docker container
``` bash
# build the docker image
docker build -t <some name> .
# run the image
docker run -p 3000:3000 -d <some name>
```
