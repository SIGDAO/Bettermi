FROM node:20-alpine3.19
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
