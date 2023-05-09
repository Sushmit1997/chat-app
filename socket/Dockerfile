FROM node

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8800

CMD ["yarn","start"]