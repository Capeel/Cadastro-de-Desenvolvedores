# Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies including TypeScript
RUN yarn install
RUN yarn add typescript @types/node @types/react --dev

# Copy all files
COPY . .

# Build the Next.js application
RUN yarn build

# Production Stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies including TypeScript
RUN yarn install

# Copy built application from builder stage
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.ts ./

# Expose the port the app runs on
EXPOSE 3001

# Start the application in development mode for hot reload
CMD ["yarn", "dev"]
