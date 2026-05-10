# Quick Start Guide 🚀

## What Was Created

A complete **Employee Reward Management System** with React Frontend + Node.js Backend + MongoDB Database.

### 📂 Project Location
```
/Users/Adit/Desktop/HRM CA2/reward-management-system/
```

---

## ⚡ Quick Setup (5 Minutes)

### 1️⃣ Setup MongoDB
```bash
# macOS - if you don't have MongoDB
brew install mongodb-community
brew services start mongodb-community
```

### 2️⃣ Start Backend
```bash
cd /Users/Adit/Desktop/HRM\ CA2/reward-management-system/backend

# Install dependencies (one-time)
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reward_management
JWT_SECRET=your_secret_key_12345
JWT_EXPIRE=7d
EOF

# Start server
npm run dev
```

Output: `Server running on port 5000` ✅

### 3️⃣ Start Frontend (New Terminal)
```bash
cd /Users/Adit/Desktop/HRM\ CA2/reward-management-system/frontend

# Install dependencies (one-time)
npm install

# Create .env file
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start React
npm start
```

Opens: `http://localhost:3000` ✅

---

## 🧪 Test the App (2 Minutes)

### Register
1. Go to http://localhost:3000/register
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Department: IT
   - Designation: Engineer
3. Click Register

### Login
1. Go to http://localhost:3000/login
2. Enter:
   - Email: john@example.com
   - Password: password123
3. Click Login → See Dashboard ✅

### Give Rewards
1. Click "Give Rewards"
2. Register another user first (jane@example.com)
3. Select Jane in the dropdown
4. Give 50 points with reason "Great work"
5. Submit

### View Leaderboard
1. Click "Leaderboard"
2. See all employees ranked by points ✅

---

## 📊 Features Included

✅ Employee Login/Registration
✅ Attendance Tracking
✅ Performance Reviews
✅ Reward Points System
✅ Bonus Management
✅ Badge Achievements
✅ Feedback & Reviews
✅ Leaderboard
✅ User Dashboard
✅ Profile Management

---

## 📁 Project Structure

```
reward-management-system/
├── backend/                      # Node.js API
│   ├── server.js                # Main server file
│   ├── package.json
│   ├── .env.example
│   ├── models/                  # MongoDB schemas
│   ├── controllers/             # Business logic
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Auth & validation
│   └── config/                  # Database config
│
├── frontend/                     # React app
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # UI components
│   │   ├── services/           # API calls
│   │   ├── styles/             # CSS files
│   │   └── App.js              # Main app
│   ├── package.json
│   └── .env.example
│
├── README.md                     # Full documentation
├── INSTALLATION.md              # Detailed setup
├── API_REFERENCE.md             # API endpoints
├── PROJECT_SUMMARY.md           # Features & details
└── .gitignore
```

---

## 🔑 Admin Credentials (Optional)

For testing admin features, you can modify the .env:
```
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=admin123
```

---

## 📚 Documentation Files

1. **README.md** - Complete project overview, features, technology stack
2. **INSTALLATION.md** - Step-by-step setup guide with troubleshooting
3. **API_REFERENCE.md** - Complete API endpoint documentation
4. **PROJECT_SUMMARY.md** - Features list, technical details, future improvements

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
brew services list

# Kill port if in use
lsof -i :5000
kill -9 <PID>
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start
```

### Can't connect to MongoDB
```bash
# Start MongoDB
brew services start mongodb-community

# Or use cloud MongoDB Atlas
# Update MONGODB_URI in .env
```

---

## 🌐 API Testing

### Test API with curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@test.com",
    "password":"password123",
    "department":"IT",
    "designation":"Engineer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@test.com",
    "password":"password123"
  }'
```

---

## 📈 Next Steps

### Deploy to Production
- See INSTALLATION.md for Heroku/AWS deployment

### Add More Features
- See PROJECT_SUMMARY.md for future enhancements
- Mobile app with React Native
- AI integration with Copilot/Power BI
- Real-time WebSocket updates

### Customize for Your Organization
- Update badge definitions
- Modify reward categories
- Adjust point values
- Customize UI colors/branding

---

## 🎓 Academic Requirements

✅ **Q1**: Complete reward system with all features
✅ **Q2**: Ready for AI tool integration
✅ **Q3**: Fully documented and explained

---

## 📞 Need Help?

Refer to:
- **Setup Issues**: See INSTALLATION.md
- **API Questions**: See API_REFERENCE.md
- **Feature Details**: See README.md or PROJECT_SUMMARY.md
- **Code Issues**: Check error messages in terminal

---

## 🎉 You're All Set!

Your full-stack reward management system is ready to use!

**Start Backend**: `npm run dev` (from backend folder)
**Start Frontend**: `npm start` (from frontend folder)
**Access App**: http://localhost:3000

Happy coding! 🚀
