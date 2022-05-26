FROM node:16-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# default command in docker image but not for development mode
CMD ["node", "dist/index.js"]
