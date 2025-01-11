# User API Documentation

This API provides functionality for user management, including registration, login, updating user details, deleting users, and email verification.

## Base URL
```
http://<your-domain>/api/users
```

---

## Endpoints

### 1. Login User
**URL:** `/login`  
**Method:** POST  
**Payload:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Expected Response:**
```json
{
  "token": "<JWT_TOKEN>"
}
```

---

### 2. Register User
**URL:** `/register`  
**Method:** POST  
**Payload:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "username": "johndoe",
  "role": "user",
  "phone": "1234567890",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-01",
  "department": "IT",
  "position": "Developer",
  "hireDate": "2023-01-01",
  "skills": ["JavaScript", "Node.js"],
  "certifications": ["AWS Certified"],
  "emergencyContact": "Jane Doe"
}
```
**Expected Response:**
```json
{
  "_id": "<USER_ID>",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "username": "johndoe",
  "role": "user",
  "phone": "1234567890",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-01",
  "department": "IT",
  "position": "Developer",
  "hireDate": "2023-01-01",
  "skills": ["JavaScript", "Node.js"],
  "certifications": ["AWS Certified"],
  "emergencyContact": "Jane Doe",
  "verificationToken": "<VERIFICATION_TOKEN>",
  "tokenExpiration": "<EXPIRATION_DATE>"
}
```

---

### 3. Verify Email
**URL:** `/verify-email`  
**Method:** GET  
**Query Parameters:**
```
?email=johndoe@example.com&token=<VERIFICATION_TOKEN>
```
**Expected Response:**
```json
{
  "message": "redirecting...."
}
```

---

### 4. Get All Users
**URL:** `/`  
**Method:** GET  
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```
**Expected Response:**
```json
[
  {
    "_id": "<USER_ID>",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "username": "johndoe",
    "role": "user",
    "phone": "1234567890",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01",
    "department": "IT",
    "position": "Developer",
    "hireDate": "2023-01-01",
    "skills": ["JavaScript", "Node.js"],
    "certifications": ["AWS Certified"],
    "emergencyContact": "Jane Doe"
  }
]
```

---

### 5. Update User
**URL:** `/:id`  
**Method:** PUT  
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```
**Payload:**
```json
{
  "name": "John Updated",
  "phone": "0987654321"
}
```
**Expected Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "<USER_ID>",
    "name": "John Updated",
    "email": "johndoe@example.com",
    "username": "johndoe",
    "role": "user",
    "phone": "0987654321",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01",
    "department": "IT",
    "position": "Developer",
    "hireDate": "2023-01-01",
    "skills": ["JavaScript", "Node.js"],
    "certifications": ["AWS Certified"],
    "emergencyContact": "Jane Doe"
  }
}
```

---

### 6. Delete User
**URL:** `/:id`  
**Method:** DELETE  
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```
**Expected Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## Notes
- Ensure you replace `<JWT_TOKEN>` with a valid token obtained from the login endpoint.
- Replace `<USER_ID>` with the unique ID of the user.
- Replace `<VERIFICATION_TOKEN>` with the token sent to the user during registration.

