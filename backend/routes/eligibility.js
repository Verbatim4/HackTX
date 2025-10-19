import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import {
  calculateSSI,
  calculateSNAP,
  calculateSection8,
  calculateEITC,
  calculateMedicaidEligibility
} from '../utils/benefitCalculator.js';

const router = express.Router();

// Helper function to check all eligibilities
const checkAllEligibility = (userProfile) => {
  const {
    currentIncome,
    householdSize,
    age,
    hasDisability,
    numberOfChildren,
    maritalStatus,
    monthlyRent,
    state,
    isVeteran,
    isPregnant,
    assets
  } = userProfile.financialProfile || {};

  const results = {};

  // Federal Poverty Level 2024
  const fpl = {
    1: 15060,
    2: 20440,
    3: 25820,
    4: 31200,
    5: 36580,
    6: 41960
  };
  const baseFPL = fpl[householdSize] || 41960 + (householdSize - 6) * 5380;

  // SSI Eligibility
  results.ssi = {
    eligible: (age >= 65 || hasDisability) && currentIncome < 1913 && assets < 2000,
    estimatedAmount: calculateSSI(currentIncome, state, age, hasDisability),
    reason: (age >= 65 || hasDisability) ? 'Age or disability requirement met' : 'Must be 65+ or disabled'
  };

  // SSDI - requires work credits
  results.ssdi = {
    eligible: hasDisability && userProfile.financialProfile?.totalWorkYears >= 10,
    estimatedAmount: hasDisability && userProfile.financialProfile?.totalWorkYears >= 10 ? 1537 : 0,
    reason: 'Requires 10+ years of work history and qualifying disability'
  };

  // SNAP Eligibility
  results.snap = {
    eligible: currentIncome <= baseFPL * 1.3,
    estimatedAmount: calculateSNAP(householdSize, currentIncome, state),
    reason: currentIncome <= baseFPL * 1.3 ? 'Income within 130% FPL' : 'Income exceeds 130% FPL'
  };

  // Medicaid Eligibility
  const medicaidCheck = calculateMedicaidEligibility(currentIncome, householdSize, state, isPregnant, hasDisability);
  results.medicaid = {
    eligible: medicaidCheck.eligible,
    estimatedAmount: 0,
    reason: medicaidCheck.eligible ? `Income within eligibility threshold` : 'Income exceeds Medicaid limits'
  };

  // Medicare Eligibility
  results.medicare = {
    eligible: age >= 65 || (hasDisability && userProfile.financialProfile?.totalWorkYears >= 10),
    estimatedAmount: 0,
    reason: age >= 65 ? 'Age 65+' : hasDisability ? 'Disability with work history' : 'Not yet eligible'
  };

  // ACA Subsidies
  results.acaSubsidies = {
    eligible: currentIncome >= baseFPL && currentIncome <= baseFPL * 4,
    estimatedAmount: currentIncome <= baseFPL * 4 ? Math.round((monthlyRent * 0.3)) : 0,
    reason: 'Income between 100-400% FPL qualifies for premium tax credits'
  };

  // TRICARE
  results.tricare = {
    eligible: isVeteran,
    estimatedAmount: 0,
    reason: isVeteran ? 'Active duty, retired, or family member' : 'Military service required'
  };

  // VA Health Care
  results.vaHealth = {
    eligible: isVeteran,
    estimatedAmount: 0,
    reason: isVeteran ? 'Veterans with qualifying service' : 'Veteran status required'
  };

  // Section 8 Housing
  const section8Amount = calculateSection8(currentIncome, householdSize, monthlyRent || 1200, state);
  results.section8 = {
    eligible: currentIncome <= baseFPL * 0.5,
    estimatedAmount: section8Amount,
    reason: currentIncome <= baseFPL * 0.5 ? 'Extremely low income' : 'Income exceeds 50% area median'
  };

  // Public Housing
  results.publicHousing = {
    eligible: currentIncome <= baseFPL * 0.8,
    estimatedAmount: Math.round(currentIncome * 0.3 / 12),
    reason: 'Low income families, elderly, and disabled'
  };

  // HUD-VASH
  results.hudvash = {
    eligible: isVeteran && currentIncome <= baseFPL,
    estimatedAmount: isVeteran ? section8Amount : 0,
    reason: isVeteran ? 'Homeless veteran housing assistance' : 'Veteran status required'
  };

  // LIHEAP
  results.liheap = {
    eligible: currentIncome <= baseFPL * 1.5,
    estimatedAmount: currentIncome <= baseFPL * 1.5 ? 500 : 0,
    reason: 'Heating/cooling assistance for low-income households'
  };

  // WIC
  results.wic = {
    eligible: (isPregnant || numberOfChildren > 0) && currentIncome <= baseFPL * 1.85,
    estimatedAmount: numberOfChildren * 50,
    reason: 'Pregnant women, infants, children up to age 5'
  };

  // EITC
  results.eitc = {
    eligible: currentIncome < 63000 && currentIncome > 0,
    estimatedAmount: calculateEITC(currentIncome, numberOfChildren, maritalStatus),
    reason: 'Working individuals with earned income'
  };

  // Child Tax Credit
  results.ctc = {
    eligible: numberOfChildren > 0 && currentIncome < 200000,
    estimatedAmount: numberOfChildren * 2000,
    reason: 'Families with qualifying children'
  };

  // TANF
  results.tanf = {
    eligible: numberOfChildren > 0 && currentIncome <= baseFPL * 0.5,
    estimatedAmount: numberOfChildren * 150,
    reason: 'Families with dependent children, very low income'
  };

  return results;
};

// @route   GET /api/eligibility
// @desc    Check eligibility for all programs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.financialProfile?.onboardingCompleted) {
      return res.status(400).json({ message: 'Please complete onboarding first' });
    }

    const eligibility = checkAllEligibility(user);
    res.json(eligibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/eligibility/:benefitType
// @desc    Check eligibility for specific benefit
// @access  Private
router.get('/:benefitType', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.financialProfile?.onboardingCompleted) {
      return res.status(400).json({ message: 'Please complete onboarding first' });
    }

    const allEligibility = checkAllEligibility(user);
    const benefitEligibility = allEligibility[req.params.benefitType];

    if (!benefitEligibility) {
      return res.status(404).json({ message: 'Benefit type not found' });
    }

    res.json(benefitEligibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

