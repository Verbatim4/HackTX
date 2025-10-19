# Polara Setup Guide

## Quick Start

### Option 1: Automated Setup (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polara
JWT_SECRET=your_secret_key_here
ENCRYPTION_KEY=your_32_character_key_here
ELEVEN_LABS_API_KEY=your_api_key
GEMINI_API_KEY=your_api_key
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Required API Keys

### 1. Eleven Labs API (Voice Features)
- Sign up: https://elevenlabs.io
- Navigate to Profile → API Keys
- Copy your API key
- Add to backend `.env` as `ELEVEN_LABS_API_KEY`

### 2. Google Gemini API (AI Intent Classification)
- Visit: https://makersuite.google.com/app/apikey
- Click "Create API Key"
- Copy the key
- Add to backend `.env` as `GEMINI_API_KEY`

### 3. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Linux
   sudo systemctl start mongod
   
   # Mac
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   ```
3. Use connection string: `mongodb://localhost:27017/polara`

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string (Connect → Drivers)
4. Replace `<password>` and add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:<password>@cluster.mongodb.net/polara
   ```

## Testing the Application

### 1. Access the Application
- Open browser to http://localhost:3000
- You should see the Polara starter page with animated stars

### 2. Create an Account
- Swipe right or click "Swipe right to start"
- Fill in the registration form on the right side
- Select your role (retired/disabled/veteran)
- Select your state
- Click "Join us!"

### 3. Explore the Dashboard
- View the solar system with benefit planets
- Click on any planet to see benefits in that category
- Try the voice button (bottom left) to issue voice commands

### 4. Test Voice Commands
- Click the microphone button
- Say: "Show me healthcare benefits"
- The app should navigate to the healthcare page

### 5. Customize Settings
- Click profile icon (top right)
- Change language
- Adjust accessibility settings
- Save changes

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use: `lsof -i :5000`

### Frontend won't start
- Check if backend is running first
- Verify port 3000 is not in use: `lsof -i :3000`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Voice commands not working
- Verify Gemini API key is valid
- Check browser console for errors
- Ensure microphone permissions are granted

### Database connection fails
- Verify MongoDB is running
- Check connection string in `.env`
- For Atlas, verify IP whitelist includes your IP

## Development Tips

### Hot Reload
Both frontend and backend support hot reload. Changes will automatically refresh.

### API Testing
Use tools like Postman or Insomnia to test API endpoints:
- `POST http://localhost:5000/api/auth/register`
- `POST http://localhost:5000/api/auth/login`
- `GET http://localhost:5000/api/benefits/healthcare` (requires auth token)

### Database Inspection
Use MongoDB Compass to view and manage database:
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`
- Database: `polara`

## Next Steps

1. Get API keys for Eleven Labs and Gemini
2. Set up MongoDB (local or Atlas)
3. Configure `.env` file
4. Run the application
5. Create a test account
6. Explore features!

For more information, see the main README.md file.

