# Build stage
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts && npm cache clean --force
COPY . .
RUN npm run build

# Production stage
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force \
    && groupadd -r appuser && useradd -r -g appuser appuser \
    && chown -R appuser:appuser /app
COPY --from=builder --chown=appuser:appuser /app/dist ./dist
USER appuser
EXPOSE 50051
CMD ["node", "dist/main"]