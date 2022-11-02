FROM node:lts
RUN apt-get update -y && apt-get install g++ make python3
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start-prod"]
