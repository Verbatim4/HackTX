# Polara - Your Financial North Star

Polara is a comprehensive government benefits optimization platform designed for retired, disabled, and veteran users. It uses an intuitive solar system metaphor to visualize and manage benefit eligibility across healthcare, housing, food, transportation, and financial assistance programs.

## Features

- **🌟 Solar System Dashboard**: Interactive visualization with planets representing different benefit categories
- **🗣️ Voice Commands**: AI-powered voice assistant using Eleven Labs and Gemini API
- **🌍 Multilingual Support**: Available in 7 languages (English, Spanish, French, Chinese, Hindi, Tagalog, Vietnamese)
- **♿ Accessibility**: Font size adjustment, color blindness filters, dyslexia-friendly fonts, high contrast mode
- **💰 Benefit Calculators**: Real-time calculations for SSI, SNAP, Section 8, EITC, and more
- **🔔 Smart Alerts**: Notifications for benefit changes, rule updates, and income adjustments

## Technology Stack

### Frontend
- React + Vite
- TailwindCSS for styling
- Framer Motion for animations
- Redux Toolkit for state management
- react-i18next for internationalization
- Axios for API calls

### Backend
- Node.js + Express
- MongoDB + Mongoose ODM
- JWT authentication
- AES-256 encryption for sensitive data
- Eleven Labs API for speech-to-text/text-to-speech
- Google Gemini API for intent classification

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Eleven Labs API key
- Google Gemini API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (use `.env.example` as template):
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polara
JWT_SECRET=your_jwt_secret_key_here
ENCRYPTION_KEY=your_32_character_encryption_key
ELEVEN_LABS_API_KEY=your_eleven_labs_api_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Keys

### Eleven Labs API
1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Get your API key from the dashboard
3. Add to backend `.env` file

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to backend `.env` file

### MongoDB
- **Local**: Install MongoDB locally and use `mongodb://localhost:27017/polara`
- **Cloud**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and use the connection string

## Project Structure

```
HackTX/
├── backend/
│   ├── config/           # Database configuration
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── utils/            # Utility functions
│   └── server.js         # Express server
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store and slices
│   │   ├── i18n/         # Translation files
│   │   ├── services/     # API services
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static assets
│   └── index.html        # HTML template
└── README.md
```

## Benefit Categories

### 🏥 Healthcare
- Medicaid
- Medicare
- ACA Subsidies
- TRICARE
- VA Health Care
- Ryan White HIV/AIDS Program
- State Pharmaceutical Assistance Programs

### 🏠 Housing
- Section 8 Housing Choice Vouchers
- Public Housing
- HUD-VASH (Veterans)
- LIHEAP (Energy Assistance)
- Emergency Rental Assistance
- Weatherization Assistance
- Property Tax Relief

### 🍎 Food
- SNAP (Food Stamps)
- WIC
- Summer/Pandemic EBT
- Senior Food Programs
- Emergency Food Assistance

### 🚌 Transportation
- Non-Emergency Medical Transportation (NEMT)
- Paratransit Services
- Veterans Transportation
- Transit Fare Subsidies
- Vehicle Modification Grants

### 💰 SSI & Taxes
- Supplemental Security Income (SSI)
- Social Security Disability Insurance (SSDI)
- TANF
- Earned Income Tax Credit (EITC)
- Child Tax Credit (CTC)
- State Tax Credits

## Voice Commands

Try these voice commands:
- "Show me healthcare benefits"
- "Navigate to housing"
- "Check my food benefits"
- "Go to transportation"
- "Open my profile"
- "Calculate my benefits"

## Accessibility Features

### Font Size
- Small, Medium, Large options
- Applies globally across the application

### Color Blindness Filters
- Protanopia (Red-blind)
- Deuteranopia (Green-blind)
- Tritanopia (Blue-blind)

### Additional Features
- OpenDyslexic font option
- High contrast mode
- Full keyboard navigation
- ARIA labels on all interactive elements
- Voice narration support

## Languages Supported

- 🇺🇸 English
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇨🇳 Chinese (中文)
- 🇮🇳 Hindi (हिन्दी)
- 🇵🇭 Tagalog
- 🇻🇳 Vietnamese (Tiếng Việt)

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# The build folder will contain optimized production files
```

## Contributing

This project was created for HackTX. Contributions are welcome!

## License

MIT License

## Support

For support or questions, please contact the development team.

---

**Polara** - Your Financial North Star. Always in Orbit. ⭐
