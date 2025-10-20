# Base image for PocketBase: Alpine is minimal and fast for Go binaries.
FROM alpine:3.18

# Define PocketBase version as a build argument
ARG PB_VERSION=0.22.21

# Install necessary utilities (unzip for PB, ca-certificates for security, and curl for healthchecks)
RUN apk add --no-cache \
    unzip \
    ca-certificates \
    curl

# Download, unzip, and clean up PocketBase binary
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip

# Create necessary directories for data and config
WORKDIR /pb
RUN mkdir -p /pb/pb_data /pb/pb_migrations /pb/pb_public /pb/pb_hooks

# Copy local migration and hook files (if they exist)
COPY ./pocketbase/pb_migrations /pb/pb_migrations
COPY ./pocketbase/pb_hooks /pb/pb_hooks

# EXPOSE the port that PocketBase will run on
EXPOSE 8090

# Start PocketBase on the correct port and make it available to all interfaces, 
# explicitly pointing to the data directory.
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir", "/pb/pb_data"]
