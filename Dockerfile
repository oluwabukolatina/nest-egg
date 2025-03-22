FROM node:16
WORKDIR /app
#ENV HOST 0.0.0.0
COPY package*.json ./
COPY tsconfig.json ./
COPY custom_typings ./
COPY app ./app
RUN npm install
COPY . .
#EXPOSE 3000
CMD ["npm", "start" ]
