FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x node_modules/.bin/*

RUN npm run build

EXPOSE 3000

CMD ["node", "server/index.js"]
