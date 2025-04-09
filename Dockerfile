#Base Dockerfile for both web and workers
From node:20

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# CMD will be overridden at runtime via compose or CI/CD
CMD ["npm", "start"]