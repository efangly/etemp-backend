FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

RUN npx prisma generate

RUN rm -fR ./src tsconfig.json

RUN mkdir /usr/src/app/public

RUN mv /usr/src/app/default-pic.png ./public/images/

VOLUME /usr/src/app/public

EXPOSE 8080

CMD ["node", "./dist/app.js"]
