FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

RUN npx prisma generate

RUN rm -fR ./src tsconfig.json

RUN mkdir /usr/src/app/public

VOLUME /usr/src/app/public

EXPOSE 8080

CMD ["node", "./dist/server.js"]