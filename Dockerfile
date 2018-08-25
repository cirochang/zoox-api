FROM node:carbon

# Create app directory
WORKDIR /usr/src/zoox-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=production
# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
