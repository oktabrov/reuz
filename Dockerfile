FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN chmod +x node_modules/.bin/*

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "server/index.js"]
