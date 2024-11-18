# Ecommerce MERN Project

This project is an ecommerce application built using the MERN stack (MongoDB, Express, React, Node.js). It includes separate front-end and back-end directories, each with its own configuration and dependencies.

## Project Structure
.gitattributes .vscode/ settings.json Admin/ .gitignore Dockerfile eslint.config.js index.html package.json postcss.config.js public/ README.md src/ App.jsx assets/ components/ index.css ... tailwind.config.js vite.config.js Back End/ Dockerfile index.js package.json upload/ images/ docker-compose.yml Front End/ .gitignore Dockerfile eslint.config.js index.html package.json postcss.config.js public/ README.md src/ tailwind.config.js vite.config.js README.md

## Installation

### Prerequisites

- Node.js
- npm
- Docker (optional, for containerized deployment)

### Front End & Admin

1. Navigate to the `Front End` or `Admin` directory:
cd "Front End" or cd Admin
2. Install dependencies:
npm install
3. Start the development server:
npm run dev

### Back End

1. Navigate to the `Back End` directory:
cd "Back End"
2. Install dependencies:
npm install
3. Start the server:
node index.js

## Usage

- The front-end application will be available at `http://localhost:5173`.
- The admin application will be available at `http://localhost:5174`.
- The back-end server will be running on `http://localhost:4000`.

## Docker

To run the project using Docker, use the provided `docker-compose.yml` file.

### Using Docker Compose

1. Build and start the containers:
docker-compose up --build
2. The front-end application will be available at `http://localhost:5173`.
3. The front-end application will be available at `http://localhost:5174`.
4. The back-end server will be running on `http://localhost:4000`.

### Running Docker Containers Separately

#### Front End

1. Navigate to the `Front End` directory:
cd "Front End"
2. Build the Docker image:
docker build -t frontend .
3. Run the Docker container:
docker run -p 5173:5173 frontend

#### Admin

1. Navigate to the `Admin` directory:
cd "Admin"
2. Build the Docker image:
docker build -t admin .
3. Run the Docker container:
docker run -p 5174:5174 admin

#### Back End

1. Navigate to the `Back End` directory:
cd Back End
2. Build the Docker image:
docker build -t backend .
3. Run the Docker container:
docker run -p 4000:4000 backend
