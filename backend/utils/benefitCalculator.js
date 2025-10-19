// Benefit calculation utilities based on federal and state guidelines

export const calculateSSI = (income, state, age, isDisabled) => {
  const federalBenefitRate2024 = 943; // Individual FBR
  const countableIncome = Math.max(0, income - 20); // General income exclusion
  const ssiAmount = Math.max(0, federalBenefitRate2024 - countableIncome);
  return ssiAmount;
};

export const calculateSNAP = (householdSize, grossIncome, state) => {
  // Simplified SNAP calculation
  const maxBenefits = {
    1: 291,
    2: 535,
    3: 766,
    4: 973,
    5: 1155,
    6: 1386
  };
  
  const maxBenefit = maxBenefits[householdSize] || 1386 + (householdSize - 6) * 231;
  const netIncome = Math.max(0, grossIncome - (householdSize * 200)); // Simplified deductions
  const thirtyPercentIncome = netIncome * 0.3;
  
  return Math.max(0, Math.round(maxBenefit - thirtyPercentIncome));
};

export const calculateSection8 = (income, familySize, fairMarketRent, state) => {
  // Section 8 voucher calculation
  const adjustedIncome = income * 0.7; // Simplified adjustment
  const thirtyPercentIncome = adjustedIncome * 0.3;
  const housingAssistance = Math.max(0, fairMarketRent - thirtyPercentIncome);
  return Math.round(housingAssistance);
};

export const calculateEITC = (income, children, filingStatus) => {
  // Earned Income Tax Credit calculation (2024)
  const eitcRates = {
    0: { max: 632, phaseOutStart: 9800, phaseOutEnd: 17640 },
    1: { max: 4213, phaseOutStart: 22610, phaseOutEnd: 49084 },
    2: { max: 6960, phaseOutStart: 22610, phaseOutEnd: 55768 },
    3: { max: 7830, phaseOutStart: 22610, phaseOutEnd: 59899 }
  };
  
  const childCount = Math.min(children, 3);
  const rates = eitcRates[childCount];
  
  if (income > rates.phaseOutEnd) return 0;
  if (income <= rates.phaseOutStart) return rates.max;
  
  const phaseOutRate = 0.1598;
  const reduction = (income - rates.phaseOutStart) * phaseOutRate;
  return Math.max(0, Math.round(rates.max - reduction));
};

export const calculateMedicaidEligibility = (income, householdSize, state, isPregnant, isDisabled) => {
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
  
  // Medicaid expansion states: 138% FPL
  // Non-expansion: varies by category
  let eligibilityThreshold = baseFPL * 1.38;
  
  if (isDisabled) eligibilityThreshold = baseFPL * 1.5;
  if (isPregnant) eligibilityThreshold = baseFPL * 2.0;
  
  return {
    eligible: income <= eligibilityThreshold,
    threshold: eligibilityThreshold,
    fpl: baseFPL
  };
};

