# Ecommerce-Website

This project is an **E-commerce website** designed to provide a seamless online shopping experience.
It is built with **modern web technologies** and follows a **microservices architecture**, ensuring scalability and maintainability.

The system is divided into three main components:

* **Admin** – Dashboard for managing products, users, and orders.
* **Frontend** – Customer-facing website for browsing and purchasing products.
* **Backend** – API and business logic for authentication, product management, orders, and more.

---

## 🚀 Project Structure

```plaintext
.gitattributes
.vscode/
  settings.json
admin/                  # Admin dashboard (React + Tailwind + Vite)
  .gitignore
  Dockerfile
  eslint.config.js
  index.html
  package.json
  postcss.config.js
  public/
  README.md
  src/
    App.jsx
    assets/
    ...
  tailwind.config.js
  vite.config.js

Back End/               # Backend API (Node.js + Express)
  Dockerfile
  index.js
  package.json
  upload/
    images/

docker-compose.yml       # Multi-service orchestration

Front End/              # Customer-facing website (React + Tailwind + Vite)
  .gitignore
  Dockerfile
  eslint.config.js
  index.html
  package.json
  postcss.config.js
  public/
  README.md
  src/
    ...
  tailwind.config.js
  vite.config.js

nginx.conf              # Nginx reverse proxy configuration
package.json
README.md
```

---

## 🛠️ Technologies Used

* **Frontend & Admin**: React, Tailwind CSS, Vite
* **Backend**: Node.js, Express
* **Database**: (e.g., MySQL / MongoDB – update depending on your setup)
* **Containerization**: Docker & Docker Compose
* **Reverse Proxy**: Nginx

---

## ⚙️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [Docker](https://www.docker.com/) & Docker Compose

### Run with Docker Compose

```bash
docker-compose up --build
```

This will start **Frontend**, **Admin**, **Backend**, and **Nginx**.

### Run Locally (development mode)

1. Navigate into a service folder (e.g., `Front End/` or `admin/`).
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the service:

   ```bash
   npm run dev
   ```

---

## 📂 Components Overview

* **Admin** → Manage products, users, and orders.
* **Frontend** → Customers browse, add to cart, and checkout.
* **Backend** → Provides REST APIs for authentication, products, cart, and orders.

---

## 📌 Next Steps

* Implement CI/CD pipelines
* Add unit/integration testing
* Enhance security (JWT, HTTPS, etc.)

---

## 📄 License

This project is licensed under the MIT License.
