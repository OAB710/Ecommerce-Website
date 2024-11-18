Here's a formatted version of the text ready for insertion into a `README.md` file:

```markdown
# Ecommerce-Website

This project is an E-commerce website designed to provide a seamless online shopping experience. The application is built using modern web technologies and follows a microservices architecture, ensuring scalability and maintainability. 

The project is divided into three main components: **Admin**, **Frontend**, and **Backend**, each serving a specific purpose within the application.

---

## Project Structure

```plaintext
.gitattributes
.vscode/
  settings.json
admin/
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
Back End/
  Dockerfile
  index.js
  package.json
  upload/
    images/
docker-compose.yml
Front End/
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
nginx.conf
package.json
README.md
```

---

## Prerequisites

- **Docker**
- **Docker Compose**
- **Node.js**
- **npm**

---

## Getting Started

### 1. Install Dependencies
Navigate to each service directory (`admin`, `Front End`, `Back End`) and install the dependencies:

```bash
cd admin
npm install

cd ../Front\ End
npm install

cd ../Back\ End
npm install
```

### 2. Build and Run the Docker Containers
Ensure Docker and Docker Compose are installed on your machine. Then, run the following command from the root directory to build and start the containers:

```bash
docker-compose up --build
```

### 3. Access the Application

- **Admin Interface**: [http://localhost:5174](http://localhost:5174)
- **Frontend Interface**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

---

## Services

### Admin Service
- **Purpose**: Manages the content and settings of the E-commerce platform.
- **Technology**: Built using React and Vite.
- **Docker Configuration**: Defined in the `admin` directory with its own `Dockerfile`.
- **Ports**: Exposed on port `5174`.
- **Command**: Runs the development server using `npm run dev`.

### Frontend Service
- **Purpose**: Provides the customer-facing interface for browsing products and making purchases.
- **Technology**: Built using React and Vite.
- **Docker Configuration**: Defined in the `Front End` directory with its own `Dockerfile`.
- **Ports**: Exposed on port `5173`.
- **Command**: Runs the development server using `npm run dev`.

### Backend Service
- **Purpose**: Handles the core business logic, data management, and API endpoints.
- **Technology**: Built using Node.js and Express, with MongoDB as the database.
- **Docker Configuration**: Defined in the `Back End` directory with its own `Dockerfile`.
- **Ports**: Exposed on port `4000`.
- **Command**: Runs the server using `node index.js`.

### Nginx Service
- **Purpose**: Acts as a reverse proxy to route requests to the appropriate backend services.
- **Docker Configuration**: Uses the official Nginx image.
- **Ports**: Exposed on port `80`.
- **Configuration**: Custom Nginx configuration is provided in the `nginx.conf` file.

### Redis Service
- **Purpose**: Provides caching to improve performance.
- **Docker Configuration**: Uses the official Redis image.
- **Ports**: Exposed on port `6379`.

---

## API Endpoints

### User Authentication
- **Signup**: `POST /signup`
- **Login**: `POST /login`

### Product Management
- **Get All Products**: `GET /allproducts`
- **Add Product**: `POST /addproduct`
- **Remove Product**: `POST /removeproduct`

### Cart Management
- **Add to Cart**: `POST /addtocart`
- **Remove from Cart**: `POST /removefromcart`
- **Get Cart**: `POST /getcart`

---

## Usage

1. Register a new user or login with existing credentials.
2. Browse products and add them to your cart.
3. Proceed to checkout and place an order.
4. Admin can login to the admin panel to manage products and orders.

---

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

---

## License

This project is licensed under the MIT License.
```

This markdown file will display well on GitHub or similar platforms, with clear sections and formatting.