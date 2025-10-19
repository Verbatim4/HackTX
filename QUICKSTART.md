# 🚀 Polara Quick Start Guide

## What Was Built

A complete full-stack government benefits optimization platform with:
- ✅ React frontend with beautiful UI (matching your design screenshots)
- ✅ Node.js/Express backend with MongoDB
- ✅ Voice commands with Eleven Labs & Gemini AI
- ✅ 7 languages (English, Spanish, French, Chinese, Hindi, Tagalog, Vietnamese)
- ✅ Full accessibility features
- ✅ 5 benefit categories with 36+ programs
- ✅ Real-time calculators for SSI, SNAP, EITC, etc.

## Before You Start

### 1. Get API Keys (Required)

**Eleven Labs** (for voice features):
1. Go to https://elevenlabs.io and sign up
2. Navigate to Profile → API Keys
3. Copy your API key

**Google Gemini** (for AI):
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

**MongoDB** (choose one):
- **Option A (Easy)**: Use MongoDB Atlas cloud
  1. Go to https://www.mongodb.com/cloud/atlas
  2. Create free cluster
  3. Get connection string
  
- **Option B (Local)**: Install MongoDB locally
  1. Download from https://www.mongodb.com/try/download/community
  2. Install and start service

### 2. Configure Environment

Edit `backend/.env` file (or create it from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polara
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/polara

JWT_SECRET=change_this_to_random_string
ENCRYPTION_KEY=32_character_encryption_key_here
ELEVEN_LABS_API_KEY=your_eleven_labs_key_here
GEMINI_API_KEY=your_gemini_key_here
NODE_ENV=development
```

## 🎯 Start the Application

### Option 1: One-Command Start (Linux/Mac)
```bash
./start.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🎮 Using the Application

### First Time Setup
1. Open http://localhost:3000
2. You'll see the animated Polara intro page
3. Click/swipe right to go to login
4. Create an account on the right side:
   - Full Name
   - Email
   - Password
   - Role (retired/disabled/veteran)
   - State

### Exploring Features

**Dashboard:**
- Click planets to explore benefit categories
- Sun in center = SSI & Tax benefits
- 4 planets = Healthcare, Housing, Food, Transportation

**Voice Commands** (click mic button):
- "Show me healthcare benefits"
- "Navigate to housing"
- "Go to my profile"
- "Check food benefits"

**Accessibility** (Profile page):
- Change language (top selector)
- Adjust font size
- Enable color blindness filters
- Toggle dyslexia-friendly font
- High contrast mode

**Calculators** (SSI/Taxes page):
- Enter your income
- Number of children
- Calculate EITC credit

## 📁 Project Structure

```
HackTX/
├── backend/              Backend API
│   ├── models/          MongoDB schemas
│   ├── routes/          API endpoints
│   ├── middleware/      Auth middleware
│   └── utils/           Calculators & encryption
├── frontend/            React application
│   ├── src/
│   │   ├── pages/      8 complete pages
│   │   ├── components/ Voice & Alerts
│   │   ├── store/      Redux state
│   │   └── i18n/       7 languages
└── Documentation files
```

## 🔧 Troubleshooting

**"Cannot connect to MongoDB"**
- Check if MongoDB is running
- Verify connection string in `.env`

**"Voice commands not working"**
- Verify Gemini API key is correct
- Allow microphone permissions in browser

**"Backend error 500"**
- Check all API keys are set in `.env`
- Look at backend console for specific error

**Port already in use**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

## 📚 Key Files Reference

**Backend:**
- `server.js` - Main server file
- `routes/auth.js` - Login/register
- `routes/benefits.js` - All benefit data
- `routes/voice.js` - Eleven Labs integration
- `routes/ai.js` - Gemini AI integration

**Frontend:**
- `App.jsx` - Main app with routing
- `pages/Dashboard.jsx` - Solar system UI
- `pages/LoginPage.jsx` - Auth page
- `components/VoiceButton.jsx` - Voice feature
- `store/` - Redux state management

## 🎨 Design Implementation

All three screenshots you provided have been implemented:
1. ✅ **Starter page** - POLARA logo with star background
2. ✅ **Login page** - Split-screen design with purple gradient
3. ✅ **Dashboard** - Solar system with sun and planets

## 📝 Testing Checklist

- [ ] Can create an account
- [ ] Can login
- [ ] Dashboard displays with animated planets
- [ ] Can click planets to view benefits
- [ ] Can change language in profile
- [ ] Can adjust accessibility settings
- [ ] Voice button appears (bottom left)
- [ ] Notification bell appears (top right)
- [ ] Calculator works on SSI page

## 🚀 Next Steps

1. **Get your API keys** (most important!)
2. **Configure `.env` file** with your keys
3. **Start the application** using `./start.sh` or manually
4. **Create a test account** and explore
5. **Try voice commands** with the microphone
6. **Switch languages** in profile settings
7. **Test calculators** on the SSI page

## 📞 Need Help?

1. Check `SETUP.md` for detailed setup instructions
2. Read `README.md` for full documentation
3. See `PROJECT_SUMMARY.md` for technical details

---

**You're all set! The complete Polara application is ready to run.** 🌟

Just add your API keys to the `.env` file and start exploring!

