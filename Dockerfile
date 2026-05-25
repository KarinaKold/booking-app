FROM node:20

WORKDIR /usr/src/app

COPY . .



WORKDIR /usr/src/app/server
RUN npm config set registry https://registry.npmmirror.com
RUN npm i

EXPOSE 3001

CMD [ "node", "app.js" ]