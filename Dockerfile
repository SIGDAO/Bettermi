FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3001
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
