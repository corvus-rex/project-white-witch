FROM --platform=$BUILDPLATFORM golang:1.24.6-bullseye AS builder

# Arguments for cross compilation
ARG TARGETOS=linux
ARG TARGETARCH=arm64

# Install dependencies
RUN apt-get update && apt-get install -y \
    gcc-aarch64-linux-gnu \
    pkg-config \
    libgtk-3-dev \
    libwebkit2gtk-4.0-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (18.x LTS) + npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# Copy only package files first
# COPY package.json package-lock.json ./
# RUN npm ci

# Copy the rest of the project
COPY . .
RUN rm -rf /app/frontend/node_modules/

# Install Wails CLI for host architecture
ENV PATH="/go/bin:${PATH}"
RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Verify CLI
RUN wails doctor

# Set cross-compilation for app
ENV CGO_ENABLED=1
ENV GOOS=linux
ENV GOARCH=arm64
ENV CC=aarch64-linux-gnu-gcc
ENV CXX=aarch64-linux-gnu-g++
ENV AR=aarch64-linux-gnu-ar
ENV STRIP=aarch64-linux-gnu-strip

# RUN sed -i '/onWayland:/a char *gdkBackend;' /go/pkg/mod/github.com/wailsapp/wails/v2@*/internal/frontend/desktop/linux/window.c \
#     && sed -i 's/char \*gdkBackend = getenv("XDG_SESSION_TYPE");/gdkBackend = getenv("XDG_SESSION_TYPE");/' /go/pkg/mod/github.com/wailsapp/wails/v2@*/internal/frontend/desktop/linux/window.c

# Build ARM64 binary
# RUN CGO_ENABLED=1 CC=aarch64-linux-gnu-gcc GOARCH=arm64 GOOS=linux \
#   wails build --clean --platform linux/arm64

RUN wails build --platform linux/arm64