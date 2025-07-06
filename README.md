# **Inventory System**

This monorepo is set up using **Lerna** and **npm workspaces** to manage multiple packages within the repository.

## **Getting Started**

### **Initial Setup**

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd your-repo-directory
   ```

2. Install dependencies across all packages:

   ```bash
   npm install
   ```

### **Running the Application**

- To run the **server** application from the root:

  ```bash
  npm run start:server
  ```

- To run the **client** application from the root:

  ```bash
  npm run start:client
  ```

### **Running Both Applications**

You can also run both applications simultaneously:

```bash
npm run start:all
```

## **Directory Structure**

```bash
inventory-system/
│
├── packages/
│   ├── client/           # client
│   └── server/           # server
│
├── lerna.json              # Lerna configuration file
├── package.json            # Root package.json with npm workspaces
└── README.md               # Project documentation
```

## **Swagger API Spec For Testing**

- [Server App](http://localhost:5000/docs)

## **License**

This project is licensed under the MIT License.
