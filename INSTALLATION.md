# Installation & Deployment Guide

## Quick Start Guide

### 1. MongoDB Setup

#### Option A: Local MongoDB
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify MongoDB is running
mongo --version
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/reward_management`

### 2. Backend Installation

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reward_management
JWT_SECRET=dev_jwt_secret_key_12345
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=admin123
EOF

# Start development server
npm run dev

# Output should show:
# MongoDB Connected: localhost
# Server running on port 5000
```

### 3. Frontend Installation

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start React development server
npm start

# Browser opens to http://localhost:3000
```

## Testing the Application

### Sample Test Data

#### 1. Register a New Employee
```
URL: http://localhost:3000/register
Test Data:
- First Name: John
- Last Name: Doe
- Email: john@company.com
- Password: password123
- Department: IT
- Designation: Software Engineer
```

#### 2. Login
```
URL: http://localhost:3000/login
Email: john@company.com
Password: password123
```

#### 3. Create More Users (for testing rewards)
Register multiple employees:
- jane@company.com (Sales)
- alex@company.com (HR)
- mike@company.com (Operations)

#### 4. Test Reward System
1. Login as employee
2. Go to "Give Rewards"
3. Select a colleague
4. Give 10-50 reward points
5. (As Manager) Approve the reward

#### 5. Test Feedback
1. Go to "Feedback"
2. Give positive/constructive feedback to colleagues
3. View received feedback

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@company.com",
    "password":"password123",
    "department":"IT",
    "designation":"Engineer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@company.com","password":"password123"}'

# Get leaderboard (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/rewards/leaderboard \
  -H "Authorization: Bearer TOKEN"
```

## Environment Configuration

### Backend .env Variables
```
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/reward_management

# Authentication
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRE=7d

# Email (Gmail SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Admin credentials
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=admin123
```

### Frontend .env Variables
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
ps aux | grep mongod

# For macOS
brew services list

# Start MongoDB if stopped
brew services start mongodb-community

# Check MongoDB version
mongo --version
```

### Backend Server Issues
```bash
# Port already in use
lsof -i :5000
kill -9 <PID>

# Clear npm cache
npm cache clean --force

# Reinstall packages
rm -rf node_modules
npm install
```

### Frontend Issues
```bash
# Clear React cache
npm cache clean --force

# Clear browser cache and restart
npm start

# Check if port 3000 is available
lsof -i :3000
```

## Database Initialization

### Create Initial Badges (Optional)
```bash
# Connect to MongoDB
mongo reward_management

# Insert sample badges
db.badges.insertMany([
  {
    name: "Starter",
    description: "Your first rewards",
    pointsRequired: 10,
    category: "achievement"
  },
  {
    name: "Rising Star",
    description: "Earned 50 points",
    pointsRequired: 50,
    category: "milestone"
  },
  {
    name: "Top Performer",
    description: "Earned 200 points",
    pointsRequired: 200,
    category: "performance"
  }
])
```

## Production Deployment

### Using Heroku

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=production_secret_key
heroku config:set MONGODB_URI=your_mongodb_atlas_url

# Deploy
git push heroku main
```

### Using AWS

1. Create EC2 instance (Ubuntu 20.04)
2. Install Node.js, MongoDB, npm
3. Clone repository
4. Configure environment variables
5. Start application with PM2

```bash
npm install -g pm2
pm2 start server.js --name "reward-system"
pm2 startup
pm2 save
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
docker build -t reward-system-backend .
docker run -p 5000:5000 --env-file .env reward-system-backend
```

## Performance Tips

1. **Database Indexing**: Add indexes on frequently queried fields
2. **Caching**: Implement Redis for leaderboard and stats
3. **Pagination**: Limit results on large queries
4. **Lazy Loading**: Load frontend components on demand
5. **API Rate Limiting**: Prevent abuse with rate limiter

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS in production
- [ ] Set secure CORS origins
- [ ] Implement request validation
- [ ] Add rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB backup
- [ ] Set up monitoring and logging

## Monitoring & Logs

```bash
# Backend logs
pm2 logs reward-system

# MongoDB logs
tail -f /usr/local/var/log/mongodb/mongod.log

# Check system resources
top
```

## Support & Help

For issues or questions, refer to:
- Backend error logs in terminal
- Browser console (F12) for frontend issues
- MongoDB logs for database issues
