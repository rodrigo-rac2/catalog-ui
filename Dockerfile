# Use the official Node.js 16 image as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Arguments that can be passed during the build
ARG BASE_URL
ARG PORT

# Set environment variables
ENV BASE_URL=${BASE_URL}
ENV PORT=${PORT}

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY src/ ./src/
COPY public/ ./public/

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE ${PORT}

# Run the specified command within the container.
CMD ["node", "src/server.js"]
