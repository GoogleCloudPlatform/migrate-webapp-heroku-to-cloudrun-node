# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose default Cloud Run port
# Cloud Run expects your container to listen on port 8080. It is referenced in the code as process.env.PORT
EXPOSE 8080

# CMD will be overridden via CI/CD or gcloud deploy
CMD ["npm", "start"]
