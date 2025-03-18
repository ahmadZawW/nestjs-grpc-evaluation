# NestJS gRPC Evaluation Microservice

This Docker image runs a NestJS application with an HTTP server on port 3000 and a gRPC microservice on port 50051. It requires an OpenAI API key to function.

## Pulling the Image
Download the image from Docker Hub:
```bash
docker pull ahmad123aboadas123/nestjs-grpc-evaluation
```

## Running the Image

You need to provide an `OPENAI_API_KEY`. Choose one of these methods:

### Option 1: With `-e` Flag
Run with your OpenAI API key directly:
```bash
docker run -p 50051:50051 \
  -e OPENAI_API_KEY=<your-openai-api-key> \
  ahmad123aboadas123/nestjs-grpc-evaluation
```

### Option 2: With an `.env` File
Create a `.env` file with:
```
OPENAI_API_KEY=<your-openai-api-key>
```
Then run:
```bash
docker run -p 50051:50051 \
  --env-file .env \
  ahmad123aboadas123/nestjs-grpc-evaluation
```
## Stopping the Container
### list the containers
```bash
docker container ls
```
### stop the container by container id
```bash
docker stop <container_id>
```
## Notes
- Replace `<your-openai-api-key>` with your actual OpenAI API key.
- Ensure your host port 50051 is free when running the container.
- Check logs if it fails:
  ```bash
  docker logs <container_id>
  ```
