# Inventory System API

A backend system for barcode-driven inventory management with Kanban-style categorization.

## Features

- 📦 **Barcode Scanning** — Fetch product details from external API using barcode
- 🗂️ **Kanban Categories** — Drag & drop support via category updates
- 🛠️ **RESTful APIs** — Add, list, and update products with MongoDB
- ⚙️ **Modular Architecture** — Cleanly organized using TypeScript and layered structure

---

## Tech Stack

- **Node.js** & **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **Zod** for validation
- **Axios** for external API requests

---

## Prerequisites

- Node.js >= 18.x
- MongoDB (Atlas or Local)
- Docker & Docker Compose (optional)

---

## Environment Variables

Create a `.env` file at the root:

```env
PORT="your desired port i.e 5000"
MONGO_URI="mongodb connection uri"
```
