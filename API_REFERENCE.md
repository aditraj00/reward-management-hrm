# API Reference Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login/register) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### 1. Register New User
```
POST /auth/register

Request Body:
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 6 chars)",
  "department": "string (required)",
  "designation": "string (required)",
  "role": "string (optional, default: 'employee')" // employee, manager, admin
}

Success Response (201):
{
  "success": true,
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "name": "First Last",
    "email": "email@example.com",
    "role": "employee"
  }
}

Error Response (400):
{
  "success": false,
  "message": "Email already exists" // or other error
}
```

### 2. Login User
```
POST /auth/login

Request Body:
{
  "email": "string (required)",
  "password": "string (required)"
}

Success Response (200):
{
  "success": true,
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "name": "First Last",
    "email": "email@example.com",
    "role": "employee",
    "department": "IT",
    "rewardPoints": 0
  }
}

Error Response (401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 3. Get Current User
```
GET /auth/me

Headers:
Authorization: Bearer <token>

Success Response (200):
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "employee",
    "department": "IT",
    "designation": "Software Engineer",
    "rewardPoints": 50,
    "totalBonusAmount": 5000,
    "badges": ["badge_id_1", "badge_id_2"],
    "isActive": true
  }
}
```

### 4. Logout
```
GET /auth/logout

Success Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Employee Endpoints

### 1. Get All Employees
```
GET /employees

Query Parameters (optional):
- department: string (filter by department)
- role: string (filter by role)

Success Response (200):
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "employee_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "department": "IT",
      "designation": "Engineer",
      "rewardPoints": 50,
      "badges": []
    }
  ]
}
```

### 2. Get Single Employee
```
GET /employees/:id

Success Response (200):
{
  "success": true,
  "data": {
    "_id": "employee_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "employee",
    "department": "IT",
    "designation": "Engineer",
    "rewardPoints": 50,
    "totalBonusAmount": 5000,
    "badges": ["badge_id"],
    "isActive": true
  }
}
```

### 3. Update Employee
```
PUT /employees/:id

Request Body (all optional):
{
  "firstName": "string",
  "lastName": "string",
  "department": "string",
  "designation": "string",
  "profilePicture": "url_string"
}

Success Response (200):
{
  "success": true,
  "data": { /* updated employee */ }
}
```

### 4. Delete Employee (Soft Delete)
```
DELETE /employees/:id

Requires: Admin role

Success Response (200):
{
  "success": true,
  "message": "Employee deactivated successfully"
}
```

### 5. Get All Badges
```
GET /employees/badges/all

Success Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "badge_id",
      "name": "Rising Star",
      "description": "Earned 50 reward points",
      "pointsRequired": 50,
      "category": "milestone"
    }
  ]
}
```

### 6. Create Badge
```
POST /employees/badges

Requires: Admin role

Request Body:
{
  "name": "string (required)",
  "description": "string (required)",
  "icon": "url_string (optional)",
  "requirement": "string (required)",
  "pointsRequired": "number (required)",
  "category": "string (enum: achievement|milestone|special|performance)"
}

Success Response (201):
{
  "success": true,
  "data": { /* badge object */ }
}
```

### 7. Get Employee Badges
```
GET /employees/:id/badges

Success Response (200):
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "badge_id",
      "name": "Rising Star",
      "description": "Earned 50 points",
      "pointsRequired": 50
    }
  ]
}
```

---

## Attendance Endpoints

### 1. Get All Attendance Records
```
GET /attendance

Query Parameters (optional):
- employeeId: string
- month: string (format: YYYY-MM)

Success Response (200):
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "record_id",
      "employee": { "_id", "firstName", "lastName" },
      "date": "2024-01-15T00:00:00.000Z",
      "status": "present",
      "checkInTime": "09:00",
      "checkOutTime": "18:00",
      "remarks": "none"
    }
  ]
}
```

### 2. Mark Attendance
```
POST /attendance

Requires: Manager or Admin role

Request Body:
{
  "employeeId": "string (required)",
  "date": "string (required, format: YYYY-MM-DD)",
  "status": "string (required, enum: present|absent|leave|half-day)",
  "checkInTime": "string (optional, format: HH:mm)",
  "checkOutTime": "string (optional, format: HH:mm)",
  "remarks": "string (optional)"
}

Success Response (201):
{
  "success": true,
  "data": { /* attendance record */ }
}
```

### 3. Get Attendance Stats
```
GET /attendance/stats/:employeeId

Success Response (200):
{
  "success": true,
  "stats": {
    "totalDays": 20,
    "present": 18,
    "absent": 1,
    "leave": 1,
    "halfDay": 0,
    "attendancePercentage": "90.00"
  }
}
```

### 4. Update Attendance
```
PUT /attendance/:id

Requires: Manager or Admin role

Request Body:
{
  "status": "present|absent|leave|half-day",
  "checkInTime": "HH:mm",
  "checkOutTime": "HH:mm",
  "remarks": "string"
}

Success Response (200):
{
  "success": true,
  "data": { /* updated record */ }
}
```

---

## Performance Endpoints

### 1. Get All Performance Reviews
```
GET /performance

Query Parameters (optional):
- employeeId: string
- month: string (format: YYYY-MM)

Success Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "review_id",
      "employee": { "_id", "firstName", "lastName" },
      "ratedBy": { "_id", "firstName" },
      "rating": 4,
      "month": "2024-01",
      "productivityScore": 85,
      "qualityScore": 90,
      "teamworkScore": 88,
      "communicationScore": 85
    }
  ]
}
```

### 2. Create Performance Review
```
POST /performance

Requires: Manager or Admin role

Request Body:
{
  "employee": "string (required, user ID)",
  "rating": "number (required, 1-5)",
  "month": "string (required, format: YYYY-MM)",
  "productivityScore": "number (0-100)",
  "qualityScore": "number (0-100)",
  "teamworkScore": "number (0-100)",
  "communicationScore": "number (0-100)",
  "comments": "string (optional)"
}

Success Response (201):
{
  "success": true,
  "data": { /* performance record */ }
}
```

### 3. Get Performance Stats
```
GET /performance/stats/:employeeId

Success Response (200):
{
  "success": true,
  "stats": {
    "averageRating": "4.20",
    "averageProductivity": "85.00",
    "averageQuality": "88.00",
    "averageTeamwork": "86.00",
    "averageCommunication": "84.00",
    "totalReviews": 5
  }
}
```

### 4. Update Performance Review
```
PUT /performance/:id

Request Body:
{
  "rating": "number (1-5)",
  "productivityScore": "number (0-100)",
  "qualityScore": "number (0-100)",
  "teamworkScore": "number (0-100)",
  "communicationScore": "number (0-100)",
  "comments": "string"
}

Success Response (200):
{
  "success": true,
  "data": { /* updated review */ }
}
```

---

## Reward Endpoints

### 1. Get All Rewards
```
GET /rewards

Query Parameters (optional):
- receiverId: string
- giverId: string
- status: string (pending|approved|rejected)

Success Response (200):
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "reward_id",
      "giver": { "_id", "firstName", "lastName" },
      "receiver": { "_id", "firstName", "lastName" },
      "points": 50,
      "reason": "Great teamwork",
      "category": "teamwork",
      "bonus": 1000,
      "status": "approved",
      "approvedBy": { "_id", "firstName" }
    }
  ]
}
```

### 2. Give Reward
```
POST /rewards

Request Body:
{
  "receiver": "string (required, user ID)",
  "points": "number (required, 1-100)",
  "reason": "string (required)",
  "category": "string (enum: teamwork|innovation|quality|customer-service|leadership|other)",
  "bonus": "number (optional)"
}

Success Response (201):
{
  "success": true,
  "data": { /* reward record */ }
}
```

### 3. Approve Reward
```
PUT /rewards/:id/approve

Requires: Manager or Admin role

Success Response (200):
{
  "success": true,
  "message": "Reward approved successfully",
  "data": { /* approved reward */ }
}
```

### 4. Reject Reward
```
PUT /rewards/:id/reject

Requires: Manager or Admin role

Success Response (200):
{
  "success": true,
  "message": "Reward rejected successfully",
  "data": { /* rejected reward */ }
}
```

### 5. Get Received Rewards
```
GET /rewards/received/:employeeId

Success Response (200):
{
  "success": true,
  "stats": {
    "totalPoints": 250,
    "totalBonus": 10000,
    "rewardCount": 5
  },
  "data": [ /* reward records */ ]
}
```

### 6. Get Leaderboard
```
GET /rewards/leaderboard

Success Response (200):
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "employee_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "department": "IT",
      "rewardPoints": 250,
      "totalBonusAmount": 15000,
      "badges": [3]
    }
  ]
}
```

---

## Feedback Endpoints

### 1. Get All Feedback
```
GET /feedback

Query Parameters (optional):
- employeeId: string
- resolved: boolean (true|false)

Success Response (200):
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "feedback_id",
      "employee": { "_id", "firstName", "lastName" },
      "givenBy": { "_id", "firstName" },
      "title": "Great job",
      "content": "You did excellent work",
      "rating": 5,
      "feedbackType": "positive",
      "isAnonymous": false,
      "isResolved": false
    }
  ]
}
```

### 2. Give Feedback
```
POST /feedback

Request Body:
{
  "employee": "string (required, user ID)",
  "title": "string (required)",
  "content": "string (required)",
  "rating": "number (required, 1-5)",
  "feedbackType": "string (enum: positive|constructive|suggestion)",
  "isAnonymous": "boolean (optional, default: false)"
}

Success Response (201):
{
  "success": true,
  "data": { /* feedback record */ }
}
```

### 3. Get Employee Feedback
```
GET /feedback/:employeeId

Success Response (200):
{
  "success": true,
  "count": 5,
  "data": [ /* feedback records */ ]
}
```

### 4. Get Feedback Stats
```
GET /feedback/stats/:employeeId

Success Response (200):
{
  "success": true,
  "stats": {
    "totalFeedback": 10,
    "averageRating": "4.50",
    "positiveCount": 6,
    "constructiveCount": 3,
    "suggestionCount": 1,
    "resolvedCount": 2
  }
}
```

### 5. Update Feedback (Resolve)
```
PUT /feedback/:id

Request Body:
{
  "isResolved": "boolean",
  "resolution": "string (optional)"
}

Success Response (200):
{
  "success": true,
  "data": { /* updated feedback */ }
}
```

---

## Error Responses

All errors follow this format:

```javascript
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API calls are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP

---

## Pagination

For endpoints returning large datasets, use pagination:
```
GET /endpoint?page=1&limit=20
```

---

## Sorting

Sort results using:
```
GET /endpoint?sort=-createdAt
```

Use `-` prefix for descending order.
