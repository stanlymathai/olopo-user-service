# Use multi-stage build to separate build and production stages

# Build stage
FROM node:20 AS build
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json first to leverage Docker cache
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --verbose

# Production stage
FROM node:20
WORKDIR /usr/src/app

# Copy node_modules from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Remove the unnecessary files 
RUN rm -rf .env .env.example .gitignore .dockerignore Dockerfile

# Run as non-root user for security
USER node

# Expose the port the app runs on
EXPOSE 8000

CMD ["./bin/www"]