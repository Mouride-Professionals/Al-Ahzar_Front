# Use the official Node.js image as the base image
FROM node:16-alpine

# Create a non-root user with a home directory
# RUN addgroup -S appgroup && adduser -S johnson -G appgroup

ARG APP_ENV

# Install NASM (Netwide Assembler)
RUN apk --no-cache add nasm

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY ./.npmrc ./
COPY package*.json ./
COPY ./config/development.yml  ./config/production.yml
COPY .env.$APP_ENV.example  ./.env.production.local

# Install dependencies
RUN yarn cache clean

# Install dependencies
RUN yarn install

# Copy the application code to the container
COPY . .

# Change ownership of the app directory to the non-root user
# RUN chown -R johnson:appgroup /usr/src/app

# Switch to the non-root user
# USER johnson

# Build the Next.js application
RUN yarn build

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]