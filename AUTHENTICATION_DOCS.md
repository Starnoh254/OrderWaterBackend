# Improved Authentication System Documentation

## Overview

The authentication system has been enhanced to support role-based access control with regular users and administrators.

## Key Features

- User registration and login
- Admin registration and login
- JWT-based authentication
- Role-based access control
- Admin-only routes protection

## Database Schema Changes

### User Model

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  password String
  name     String?
  role     String  @default("user") // "user" or "admin"
  createdAt DateTime @default(now())
}
```

## API Endpoints

### Authentication Routes (`/api/v1/auth`)

#### 1. Register User

- **Endpoint:** `POST /api/v1/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

#### 2. Register Admin

- **Endpoint:** `POST /api/v1/auth/register-admin`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpass123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Admin registered",
    "user": {
      "id": 2,
      "email": "admin@example.com",
      "role": "admin"
    }
  }
  ```

#### 3. Login (User/Admin)

- **Endpoint:** `POST /api/v1/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "result": {
      "token": "jwt_token_here",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "role": "user"
      }
    }
  }
  ```

### Admin Routes (`/api/v1/admin`)

#### 1. Admin Dashboard

- **Endpoint:** `GET /api/v1/admin/dashboard`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Access:** Admin only
- **Response:**
  ```json
  {
    "message": "Welcome to admin dashboard",
    "admin": {
      "userId": 2,
      "role": "admin"
    }
  }
  ```

#### 2. Get All Users

- **Endpoint:** `GET /api/v1/admin/users`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Access:** Admin only

## Middlewares

### 1. Authentication Middleware (`authMiddleware.js`)

- **Purpose:** Verifies JWT token and extracts user information
- **Usage:** Apply to all protected routes
- **Location:** `src/middlewares/authMiddleware.js`

### 2. Admin Middleware (`adminMiddleware.js`)

- **Purpose:** Checks if authenticated user has admin role
- **Usage:** Apply after authentication middleware for admin-only routes
- **Location:** `src/middlewares/adminMiddleware.js`

## Usage Examples

### Protecting a Regular Route

```javascript
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

### Protecting an Admin Route

```javascript
const authenticateToken = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

router.get("/admin-only", authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: "Admin access granted" });
});
```

## Services

### AuthService Methods

- `findUserByEmail(email)` - Find user by email
- `registerUser(email, password, role = 'user')` - Register a new user
- `registerAdmin(email, password)` - Register a new admin
- `loginUser(email, password)` - Login user/admin

## Security Features

- Password hashing using bcryptjs
- JWT tokens with expiration (1 hour)
- Role-based access control
- Input validation and error handling

## Next Steps

After implementing these changes, remember to:

1. Run `npx prisma generate` to update Prisma Client
2. Run `npx prisma migrate dev --name add-user-roles` to update database
3. Test all endpoints with appropriate authentication headers
4. Consider adding additional validation middleware for input sanitization
