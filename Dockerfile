FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm rebuild @tensorflow/tfjs-node --build-from-source
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start-prod"]