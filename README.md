# Employee Reward Management System 🏆

A comprehensive full-stack web application designed to manage employee rewards, recognition, performance tracking, and feedback in organizations. Built with **React + Node.js + MongoDB**, this system fosters a culture of appreciation and motivation in the workplace.

## 📌 Project Overview

This system is designed to meet academic requirements (CO2, CO3, CO4, CO5, CO6) and covers:

- **Q1 (Design & Development)**: A complete application with employee login, attendance, performance tracking, reward points, bonuses, badges, and feedback systems.
- **Q2 (AI Integration)**: Ready for integration with AI tools (Microsoft Copilot, Power BI, Canva AI, ML Models) for data-driven decisions.
- **Q3 (Presentation)**: Well-documented system with clear features, working process, and future improvement suggestions.

## ✨ Key Features

### 1. **Employee Authentication & Management**
- User registration and secure login with JWT
- Role-based access control (Employee, Manager, Admin)
- Profile management with badges and achievements
- Department and designation tracking

### 2. **Attendance Management**
- Daily attendance marking (Present, Absent, Leave, Half-day)
- Check-in and check-out timestamps
- Attendance statistics and monthly reports
- Attendance percentage calculation

### 3. **Performance Tracking**
- Monthly performance reviews with ratings (1-5)
- Multiple scoring metrics:
  - Productivity Score
  - Quality Score
  - Teamwork Score
  - Communication Score
- Manager/Admin review capabilities

### 4. **Reward & Points System**
- Peer-to-peer reward giving
- Configurable reward points (1-100)
- Reward categories (Teamwork, Innovation, Quality, Customer Service, Leadership)
- Manager approval workflow for rewards
- Bonus amount tracking
- Leaderboard ranking by points

### 5. **Badge System**
- Achievement-based badges
- Badge unlocking based on reward points
- Visual badge display on profiles
- Multiple badge categories (Achievement, Milestone, Special, Performance)

### 6. **Feedback & Reviews**
- Structured feedback mechanism
- Feedback types (Positive, Constructive, Suggestion)
- Anonymous feedback option
- Feedback resolution tracking
- Rating system (1-5 stars)
- Feedback statistics per employee

### 7. **Dashboard & Analytics**
- Personalized employee dashboard
- Real-time stats (points, attendance, badges)
- Top performers leaderboard
- Department-wise insights

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Custom middleware

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js (for analytics)
- **Styling**: CSS3

### Database Schema
- **Users**: Employee profiles with roles, points, badges
- **Attendance**: Daily attendance records
- **Performance**: Monthly performance reviews
- **RewardPoints**: Peer rewards and points history
- **Badges**: Achievement definitions
- **Feedback**: Feedback and reviews

## 📁 Project Structure

```
reward-management-system/
├── backend/
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── Performance.js
│   │   ├── RewardPoint.js
│   │   ├── Badge.js
│   │   └── Feedback.js
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── attendanceController.js
│   │   ├── performanceController.js
│   │   ├── rewardController.js
│   │   └── feedbackController.js
│   ├── routes/                 # API endpoints
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── performanceRoutes.js
│   │   ├── rewardRoutes.js
│   │   └── feedbackRoutes.js
│   ├── middleware/
│   │   └── auth.js             # JWT verification & role authorization
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── server.js               # Main application file
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable components
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/              # Page components
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Leaderboard.js
    │   │   ├── SendRewards.js
    │   │   ├── Feedback.js
    │   │   └── MyProfile.js
    │   ├── services/           # API integration
    │   │   ├── api.js
    │   │   └── apiService.js
    │   ├── styles/             # CSS files
    │   ├── App.js              # Main app component
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── package.json
    └── .env.example
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Backend .env Configuration:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reward_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

**Start Backend:**
```bash
npm run dev
# or
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  firstName, lastName, email, password, department, designation
}
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Employee Endpoints

#### Get All Employees
```
GET /api/employees
Query: ?department=IT&role=employee
```

#### Get Employee
```
GET /api/employees/:id
```

#### Update Employee
```
PUT /api/employees/:id
Body: { firstName, lastName, department, designation }
```

### Attendance Endpoints

#### Get Attendance
```
GET /api/attendance?employeeId=xxx&month=2024-01
```

#### Mark Attendance
```
POST /api/attendance
Body: { employeeId, date, status, checkInTime, checkOutTime }
```

#### Get Attendance Stats
```
GET /api/attendance/stats/:employeeId
Response: { totalDays, present, absent, leave, attendancePercentage }
```

### Performance Endpoints

#### Get Performance Reviews
```
GET /api/performance?employeeId=xxx&month=2024-01
```

#### Create Performance Review
```
POST /api/performance
Body: {
  employee, rating, month, productivityScore, qualityScore,
  teamworkScore, communicationScore, comments
}
```

#### Get Performance Stats
```
GET /api/performance/stats/:employeeId
```

### Reward Endpoints

#### Get Rewards
```
GET /api/rewards?receiverId=xxx&status=approved
```

#### Give Reward
```
POST /api/rewards
Body: { receiver, points, reason, category, bonus }
```

#### Approve Reward
```
PUT /api/rewards/:id/approve
```

#### Get Leaderboard
```
GET /api/rewards/leaderboard
```

### Feedback Endpoints

#### Get Feedback
```
GET /api/feedback?employeeId=xxx
```

#### Give Feedback
```
POST /api/feedback
Body: {
  employee, title, content, rating, feedbackType, isAnonymous
}
```

#### Get Feedback Stats
```
GET /api/feedback/stats/:employeeId
```

## 👥 User Roles & Permissions

### Employee
- View own dashboard and profile
- Give rewards to colleagues
- Provide feedback to team members
- View leaderboard
- Track own attendance and performance
- Receive feedback and rewards

### Manager
- Mark attendance for team members
- Create performance reviews
- Approve/reject reward nominations
- View team analytics and reports
- Manage team feedback

### Admin
- Full system access
- User management
- Badge configuration
- System-wide analytics
- Role and permission management

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access Control**: Route protection based on user roles
- **Input Validation**: Server-side validation on all endpoints
- **CORS Protection**: Configured CORS for secure cross-origin requests

## 📊 Database Models

### User
```javascript
{
  firstName, lastName, email, password (hashed),
  role, department, designation,
  rewardPoints, totalBonusAmount,
  profilePicture, badges (array of badge IDs),
  isActive, createdAt, updatedAt
}
```

### Attendance
```javascript
{
  employee (ref), date, status,
  checkInTime, checkOutTime, remarks,
  createdAt
}
```

### Performance
```javascript
{
  employee (ref), rating (1-5), ratedBy (ref),
  month, productivityScore, qualityScore,
  teamworkScore, communicationScore,
  comments, createdAt, updatedAt
}
```

### RewardPoint
```javascript
{
  giver (ref), receiver (ref), points,
  reason, category, bonus, status,
  approvedBy (ref), createdAt, updatedAt
}
```

### Badge
```javascript
{
  name, description, icon, requirement,
  pointsRequired, category, createdAt
}
```

### Feedback
```javascript
{
  employee (ref), givenBy (ref), title,
  content, rating (1-5), feedbackType,
  isAnonymous, isResolved, resolution,
  createdAt, updatedAt
}
```

## 🎯 AI Integration Opportunities (Q2)

1. **Microsoft Copilot**: Generate insights from feedback and performance data
2. **Power BI**: Create dashboards for performance analytics and rewards trends
3. **Canva AI**: Auto-design certificates and reward announcements
4. **ML Models**: Predictive analysis for employee performance and churn
5. **NLP**: Sentiment analysis of feedback and reviews
6. **Data Analytics**: Identify top performers and reward patterns

## 📈 Future Enhancements

1. **Mobile Application**: React Native app for iOS/Android
2. **Real-time Notifications**: WebSocket integration for live updates
3. **Advanced Analytics**: More detailed insights and reports
4. **Gamification**: Levels, achievements, leaderboards
5. **Export Features**: PDF reports, Excel exports
6. **Integration**: Slack, Teams, Email notifications
7. **Automation**: Scheduled reports and automatic badge unlocking
8. **Multi-language**: Internationalization support
9. **Dark Mode**: Theme switching capability
10. **Advanced Search**: Full-text search across records

## 🧪 Testing

### Run Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 License

This project is licensed under Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0).
- ✔ Personal & Educational Use Only
- ❌ Commercial Use Prohibited Without Permission

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support & Contact

For questions, issues, or suggestions, please contact:
- 📧 Email: your-email@example.com
- 🔗 LinkedIn: [Your Profile]
- 💬 GitHub Issues: [Report Issues Here]

## 🎓 Academic Alignment

**Course Outcomes (CO):**
- **CO2**: Design and develop reward management system ✓
- **CO3**: Implement features for fair reward decisions ✓
- **CO4**: Integrate AI tools for data-driven insights ✓
- **CO5**: Present and explain system features ✓
- **CO6**: Analyze and suggest improvements ✓

**Bloom's Taxonomy:**
- **L5 (Create)**: Full-fledged application development ✓
- **L6 (Analyze)**: AI integration and optimization ✓

---

**Built with ❤️ for HRM Excellence**
