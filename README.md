# Entertab Backend - Express.js & MongoDB API

A fully-featured, modular RESTful backend built with **Express.js**, **TypeScript**, and **MongoDB (via Mongoose)**. The application handles five core features (Users, Contact Us, Services, Projects, and Journeys) with comprehensive CRUD operations. 

Security is enforced using **JSON Web Tokens (JWT)** and role-based access control, allowing anonymous submission/creation for select public-facing modules while restricting full list reads, modifications, and administrative operations exclusively to authenticated `admin` accounts.

---

## Key Features

1. **Modular Architecture**: Clean, separate folders for configuration, global middlewares, and feature modules.
2. **Strict TypeScript Typing**: Fully type-safe models, controllers, routers, and request typings compiled without warning under strict options.
3. **Robust Security Rules**:
   - **Users Module**: Fully secured. Registration/creation, reading, updating, and deletion require an `admin` role and valid JWT token. A public `/api/users/login` endpoint allows the administrator to sign in and obtain their token.
   - **Contact Us, Services, Projects, Journeys Modules**:
     - `POST /` (Create) is **Anonymous / Public**. This allows anyone to contact the company, request services, submit project suggestions, or register journey highlights.
     - `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id` (Read, Update, Delete) are **Admin-only** (JWT Protected).
4. **Bootstrap Admin Seeder**: On startup, the server automatically checks if any administrator exists in the database. If none are found, it safely hashes the default password and seeds a system administrator to allow immediate access and JWT retrieval.
5. **Global Express Middleware**: Custom JWT auth handler, centralized JSON response formatter, and global exception catcher.

---

## Directory Structure

```
d:/Entertab/EntertabBackend/
├── src/
│   ├── config/
│   │   ├── db.ts           # Mongoose MongoDB connection
│   │   └── env.ts          # Environment variables & configurations
│   ├── middleware/
│   │   ├── auth.interface.ts # Custom AuthenticatedRequest interface
│   │   ├── auth.middleware.ts  # JWT validation & Admin check
│   │   ├── error.middleware.ts # Global express error handler
│   │   └── validate.middleware.ts # Payload validation
│   ├── modules/
│   │   ├── users/          # Users DB schema, logins, and admin CRUD
│   │   ├── contactUs/      # Submission & management for contact requests
│   │   ├── services/       # Catalog services management
│   │   ├── projects/       # Projects portfolio management
│   │   └── journey/        # Organizational timeline journey
│   ├── app.ts              # Express App setup & middleware loading
│   └── server.ts           # Entrypoint & DB seeder execution
├── scripts/
│   └── test-endpoints.js   # Programmatic E2E API Verification suite
├── .env                    # Local environment variables
├── tsconfig.json           # Strict TypeScript options
├── package.json            # Node scripts and package dependencies
└── README.md               # Documentation
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **MongoDB**: A running local MongoDB instance on port `27017` or a remote MongoDB Atlas connection string.

### 2. Installation
Install all package dependencies:
```bash
npm install
```

### 3. Environment Setup
Create or update the `.env` file in the root directory:
```env
# Server Port
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/entertab

# JWT Parameters
JWT_SECRET=entertab_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d

# Default Bootstrapped Admin (Seeded on first run if DB is empty)
DEFAULT_ADMIN_EMAIL=admin@entertab.com
DEFAULT_ADMIN_PASSWORD=admin123
```

### 4. Running the Application

- **Development Mode** (with hot-reloading):
  ```bash
  npm run dev
  ```
- **Production Compilation**:
  ```bash
  npm run build
  npm start
  ```

---

## API Documentation & Access Controls

All module paths are nested under `/api`.

### 1. Users Module (`/api/users`)
| Method | Endpoint | Description | Authorization | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/login` | Authenticate admin and get JWT | **Public / Anonymous** | `{ email, password }` |
| **GET** | `/` | List all system users | **Admin JWT Required** | *None* |
| **GET** | `/:id` | Read single user details | **Admin JWT Required** | *None* |
| **POST** | `/` | Create a new user | **Admin JWT Required** | `{ name, email, password, role? }` |
| **PUT** | `/:id` | Modify user fields | **Admin JWT Required** | `{ name?, email?, password?, role? }` |
| **DELETE**| `/:id` | Remove user (last admin block) | **Admin JWT Required** | *None* |

### 2. Contact Us Module (`/api/contact-us`)
| Method | Endpoint | Description | Authorization | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/` | Submit partnership/contact form | **Public / Anonymous** | `{ name, email, subject, message }` |
| **GET** | `/` | List all contact messages | **Admin JWT Required** | *None* |
| **GET** | `/:id` | Read details of message | **Admin JWT Required** | *None* |
| **PUT** | `/:id` | Update status (pending, reviewed...) | **Admin JWT Required** | `{ status?, ... }` |
| **DELETE**| `/:id` | Delete submission | **Admin JWT Required** | *None* |

### 3. Services Module (`/api/services`)
| Method | Endpoint | Description | Authorization | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/` | Create a new service | **Public / Anonymous** | `{ title, description, icon?, price? }` |
| **GET** | `/` | List catalog services | **Admin JWT Required** | *None* |
| **GET** | `/:id` | Read service by ID | **Admin JWT Required** | *None* |
| **PUT** | `/:id` | Edit service details | **Admin JWT Required** | `{ title?, description?, icon?, price? }` |
| **DELETE**| `/:id` | Delete service | **Admin JWT Required** | *None* |

### 4. Projects Module (`/api/projects`)
| Method | Endpoint | Description | Authorization | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/` | Add portfolio project | **Public / Anonymous** | `{ title, description, client?, completionDate?, technologies?, imageUrl? }` |
| **GET** | `/` | List portfolio projects | **Admin JWT Required** | *None* |
| **GET** | `/:id` | Read project details | **Admin JWT Required** | *None* |
| **PUT** | `/:id` | Edit project details | **Admin JWT Required** | `{ title?, description?, client?, technologies?, ... }` |
| **DELETE**| `/:id` | Delete project | **Admin JWT Required** | *None* |

### 5. Journeys Module (`/api/journeys`)
| Method | Endpoint | Description | Authorization | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/` | Register journey milestone | **Public / Anonymous** | `{ title, description, year, milestoneType? }` |
| **GET** | `/` | List all timeline journey milestones | **Admin JWT Required** | *None* |
| **GET** | `/:id` | Read single journey milestone | **Admin JWT Required** | *None* |
| **PUT** | `/:id` | Edit timeline milestone | **Admin JWT Required** | `{ title?, description?, year?, milestoneType? }` |
| **DELETE**| `/:id` | Delete timeline milestone | **Admin JWT Required** | *None* |

---

## E2E Automated Integration Tests

To run the automated E2E test suite:
1. Ensure your local MongoDB is active.
2. Execute the verification script:
   ```bash
   npm run test-setup
   ```

The script programmatically launches a temporary development server instance on port `5055` using a separate test database (`entertab_test`), runs test sequences for each scenario, and automatically tears down the process. It asserts:
- Health check availability.
- Public anonymous creations across all modules.
- Blockade of read, update, and delete calls without a JWT.
- Blockade of user creation without administrative authorization.
- Admin token generation (via the bootstrapped email & password).
- CRUD operations using the valid admin Bearer JWT.
