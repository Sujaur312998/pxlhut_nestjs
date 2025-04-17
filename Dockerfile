FROM node:20-alpine

WORKDIR /usr/src/app

# Install netcat
# RUN apt-get update && apt-get install -y netcat

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

COPY entrypoint.sh .

# Make sure entrypoint.sh is executable
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]