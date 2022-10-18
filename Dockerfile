FROM node:16-alpine
RUN apk add --no-cache --virtual .gyp g++ make python3
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start-prod"]