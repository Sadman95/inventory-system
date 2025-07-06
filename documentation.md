
# 📦 Inventory Management System Documentation

---

## 📝 System Requirements Specification (SRS)

### 1. Introduction

#### 1.1 Purpose
This document defines the functional and non-functional requirements for the **Inventory Management System** backend and client, enabling efficient **product categorization**, **barcode-based product lookup**, **product movement across categories**, and **category management**.

#### 1.2 Intended Audience
- Backend Developers  
- Frontend Developers  
- DevOps Engineers  
- QA Testers  
- Technical Leads  

#### 1.3 Scope
- Scan & Lookup products by barcode  
- Categorize products dynamically  
- Move products between categories (Kanban-style drag & drop)  
- Create and manage categories  
- REST API with TypeScript & MongoDB  
- Modular Monorepo with Dockerized Deployment  

---

### 2. Overall Description

#### 2.1 Product Perspective
This system is a **backend and frontend solution** for managing inventory items and categories. It uses REST APIs, a barcode-based lookup system, and drag-and-drop product management.

#### 2.2 User Roles
- Inventory Managers (default role, no authentication initially)

#### 2.3 Assumptions and Dependencies
- **Monorepo Structure:** `packages/client` (React) & `packages/server` (Node.js)
- **Database:** MongoDB  
- **Barcode Scanning:** API-based lookup  
- **ORM:** Mongoose  
- **Tech Stack:**  
  - Node.js + TypeScript (Backend)  
  - React + TypeScript (Frontend)  
  - Docker + Lerna Monorepo  

---

### 3. System Features

#### 3.1 Product Management (Barcode-based)
- Fetch product by barcode from external API.
- Add product manually to the database.
- Products have minimal fields: barcode, category reference, timestamps.

#### 3.2 Category Management
- Create, edit, and list categories.
- Each category includes a name and optional product count.
- Supports moving products between categories via API (for drag & drop).

#### 3.3 Kanban Board (Client)
- Drag & drop products between categories.
- Products update their category in the backend on drag events.

---

### 4. External Interfaces

#### 4.1 REST API (Backend)
- JSON-based APIs with REST conventions.

#### 4.2 Database
- MongoDB with Mongoose ODM.

#### 4.3 Barcode Lookup API
- External API for barcode product lookup (server-side).

---

### 5. Non-functional Requirements

| Requirement       | Description                                         |
|-------------------|-----------------------------------------------------|
| Security          | No authentication for now; later JWT can be added   |
| Performance       | Optimized DB indexes on barcode & category           |
| Scalability       | Docker-based scalability (monorepo)                 |
| Maintainability   | Clean modular structure (monorepo + Docker + Lerna) |
| Dev Experience    | TypeScript, ESLint, Prettier, Hot Reload (Nodemon)  |

---

### 6. Monorepo Structure
```
inventory-monorepo/
│
├── packages/
│   ├── client/     (React Frontend)
│   └── server/     (Node.js Backend)
│
├── docker-compose.yml  (Root)
├── lerna.json           (Monorepo Config)
└── README.md            (Project Root)
```

---

## 🗂 Entity Definitions

### 📦 Product
```ts
Product {
  _id: string;
  barcode: string;
  categoryId: string; // FK to Category
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 📁 Category
```ts
Category {
  _id: string;
  name: string;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints – Inventory System Backend

---

### 🧾 Products

#### ➕ Add Product
- **Method:** POST  
- **Path:** `/api/v1/products`  
- **Body:**  
```json
{
  "barcode": "1234567890",
  "categoryId": "categoryId"
}
```
- **Response:**  
201 Created → Product object.

---

#### 📦 Get Product by Barcode
- **Method:** GET  
- **Path:** `/api/v1/products/:barcode`  
- **Response:**  
200 OK → Product object or fetched from external API.

---

#### ✏️ Update Product’s Category
- **Method:** PATCH  
- **Path:** `/api/v1/products/:id`  
- **Body:**  
```json
{
  "categoryId": "newCategoryId"
}
```
- **Response:**  
200 OK → Updated product.

---

### 📂 Categories

#### ➕ Create Category
- **Method:** POST  
- **Path:** `/api/v1/categories`  
- **Body:**  
```json
{
  "name": "Category Name"
}
```
- **Response:**  
201 Created → Category object.

---

#### 📄 List All Categories
- **Method:** GET  
- **Path:** `/api/v1/categories`  
- **Response:**  
200 OK → Array of categories with products populated.

---

## ⚙️ Development & Deployment Setup

### Development
```bash
# Install dependencies
lerna bootstrap

# Start backend
lerna run dev --scope server

# Start client
lerna run dev --scope client
```

---

### Production (Dockerized)
```bash
docker-compose up --build
```

---

## 📦 Docker Compose Example (Root)
```yaml
version: "3"
services:
  server:
    build:
      context: .
      dockerfile: packages/server/Dockerfile
    ports:
      - "5000:5000"
    env_file:
      - ./packages/server/.env
    depends_on:
      - mongo

  client:
    build:
      context: .
      dockerfile: packages/client/Dockerfile
    ports:
      - "3000:80"

  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## 📝 Future Enhancements
- JWT Authentication  
- Admin Panel  
- Multi-user Access Control  
- Product Image Upload  
- Stock Management  

---
