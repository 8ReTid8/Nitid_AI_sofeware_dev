FROM node:lastest

WORKDIR /app

COPY ./pakage.json ./
COPY ./package-lock.json ./
COPY ./prisma ./ 

RUN npm install

RUN npx prisma generate

COPY ./ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]