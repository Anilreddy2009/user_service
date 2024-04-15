FROM node:18-alpine

ENV port 8000

WORKDIR /usr/src/app

COPY package.json ./

COPY . .

RUN npm install

# Add a build step for TypeScript compilation
RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:dev"]