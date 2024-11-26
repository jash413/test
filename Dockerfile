# Stage 1: Dependencies
FROM node:20.5.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20.5.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG ENV_FILE=.env.gcloud
COPY ${ENV_FILE} .env
RUN npm run build

# Stage 3: Runner
FROM node:20.5.0-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env ./.env
ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "start"]