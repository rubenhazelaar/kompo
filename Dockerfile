FROM node
RUN npm install --save node-static
WORKDIR /usr/src/app
COPY . .
CMD node ./server.js