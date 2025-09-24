# Build Stage
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock ./

# Install all dependencies for building
RUN yarn install --production

# Copy source code
COPY . .

# Build the app
RUN yarn build

# Production Stage
FROM node:20-alpine AS production

# Create app directory
WORKDIR /usr/src/app

# Copy built application from build stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.env ./.env

# Expose API port
EXPOSE 3000

# Start the app
CMD ["yarn", "start:prod"]
