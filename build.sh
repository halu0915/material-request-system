#!/bin/bash

# Install server dependencies
cd server
npm install

# Install client dependencies and build
cd ../client
npm install
npm run build

# Install Chinese fonts for PDF generation (if on Linux)
if [ "$(uname)" != "Darwin" ]; then
  echo "Installing Chinese fonts..."
  sudo apt-get update -qq
  sudo apt-get install -y fonts-wqy-zenhei fonts-wqy-microhei
  fc-cache -f -v
  echo "Chinese fonts installed successfully"
fi

# Build server
cd ../server
npm run build

echo "Build completed successfully"
