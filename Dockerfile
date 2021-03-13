FROM node:14

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

RUN npm install
RUN npm run client-install

EXPOSE 5000

CMD ["npm", "run", "dev"]