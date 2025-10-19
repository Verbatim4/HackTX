import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['retired', 'disabled', 'veteran'], required: true },
  language: { type: String, default: 'en' },
  state: { type: String, required: true },
  accessibility: {
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    colorFilter: { type: String, enum: ['none', 'protanopia', 'deuteranopia', 'tritanopia'], default: 'none' },
    dyslexiaFont: { type: Boolean, default: false },
    highContrast: { type: Boolean, default: false },
    narrationEnabled: { type: Boolean, default: false }
  },
  financialProfile: {
    incomeHistory: [{ year: Number, amount: Number }],
    currentIncome: { type: Number, default: 0 },
    taxesPaid: { type: Number, default: 0 },
    // Comprehensive eligibility data
    householdSize: { type: Number, default: 1 },
    householdMembers: [{
      name: String,
      age: Number,
      relationship: String,
      isDisabled: Boolean,
      isPregnant: Boolean
    }],
    employmentStatus: { type: String, enum: ['employed', 'unemployed', 'retired', 'disabled', 'self-employed'], default: 'employed' },
    employmentHistory: [{
      employer: String,
      startYear: Number,
      endYear: Number,
      annualIncome: Number,
      yearsWorked: Number
    }],
    totalWorkYears: { type: Number, default: 0 },
    assets: { type: Number, default: 0 },
    monthlyRent: { type: Number, default: 0 },
    monthlyUtilities: { type: Number, default: 0 },
    medicalConditions: [String],
    currentBenefits: [String],
    hasDisability: { type: Boolean, default: false },
    isVeteran: { type: Boolean, default: false },
    veteranServiceYears: { type: Number, default: 0 },
    numberOfChildren: { type: Number, default: 0 },
    isPregnant: { type: Boolean, default: false },
    age: { type: Number, default: 0 },
    dateOfBirth: Date,
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'], default: 'single' },
    onboardingCompleted: { type: Boolean, default: false }
  },
  benefits: {
    ssi: { type: Number, default: 0 },
    healthcare: { type: Number, default: 0 },
    housing: { type: Number, default: 0 },
    utilities: { type: Number, default: 0 },
    veteran: { type: Number, default: 0 },
    transportation: { type: Number, default: 0 }
  },
  lastSynced: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);

