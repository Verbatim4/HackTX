import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  calculateSSI,
  calculateSNAP,
  calculateSection8,
  calculateEITC,
  calculateMedicaidEligibility
} from '../utils/benefitCalculator.js';

const router = express.Router();

// Benefit data by category
const benefitsData = {
  healthcare: [
    {
      id: 'medicaid',
      name: 'Medicaid',
      description: 'Health coverage for low-income individuals and families',
      eligibility: 'Income at or below 138% of Federal Poverty Level in expansion states',
      website: 'https://www.medicaid.gov',
    },
    {
      id: 'medicare',
      name: 'Medicare',
      description: 'Health insurance for people 65+ or with certain disabilities',
      eligibility: 'Age 65+ or qualifying disability',
      website: 'https://www.medicare.gov',
    },
    {
      id: 'aca-subsidies',
      name: 'Marketplace Subsidies (ACA)',
      description: 'Premium tax credits and cost-sharing reductions',
      eligibility: 'Income between 100-400% of Federal Poverty Level',
      website: 'https://www.healthcare.gov',
    },
    {
      id: 'tricare',
      name: 'TRICARE',
      description: 'Health care program for military families and retirees',
      eligibility: 'Active duty, retirees, and their families',
      website: 'https://www.tricare.mil',
    },
    {
      id: 'va-health',
      name: 'VA Health Care',
      description: 'Comprehensive health care for veterans',
      eligibility: 'Veterans with qualifying service',
      website: 'https://www.va.gov/health-care',
    },
    {
      id: 'ryan-white',
      name: 'Ryan White HIV/AIDS Program',
      description: 'HIV care and treatment services',
      eligibility: 'Living with HIV, low-income',
      website: 'https://ryanwhite.hrsa.gov',
    },
    {
      id: 'spap',
      name: 'State Pharmaceutical Assistance Programs',
      description: 'Help with prescription drug costs',
      eligibility: 'Varies by state',
      website: 'Contact your state health department',
    }
  ],
  housing: [
    {
      id: 'section-8',
      name: 'Section 8 Housing Choice Vouchers',
      description: 'Rental assistance for low-income families',
      eligibility: 'Income at or below 50% of area median income',
      website: 'https://www.hud.gov/program_offices/public_indian_housing/programs/hcv',
    },
    {
      id: 'public-housing',
      name: 'Public Housing',
      description: 'Affordable rental housing',
      eligibility: 'Low-income families, elderly, and disabled',
      website: 'https://www.hud.gov/topics/rental_assistance/phprog',
    },
    {
      id: 'pbra',
      name: 'Project-Based Rental Assistance',
      description: 'Rental assistance tied to specific units',
      eligibility: 'Very low-income households',
      website: 'https://www.hud.gov',
    },
    {
      id: 'hud-vash',
      name: 'HUD-VASH',
      description: 'Housing vouchers for homeless veterans',
      eligibility: 'Homeless veterans',
      website: 'https://www.va.gov/homeless/hud-vash.asp',
    },
    {
      id: 'liheap',
      name: 'Low-Income Home Energy Assistance Program',
      description: 'Help with heating and cooling bills',
      eligibility: 'Low-income households',
      website: 'https://www.acf.hhs.gov/ocs/liheap',
    },
    {
      id: 'wap',
      name: 'Weatherization Assistance Program',
      description: 'Home energy efficiency improvements',
      eligibility: 'Low-income households',
      website: 'https://www.energy.gov/eere/wap',
    },
    {
      id: 'era',
      name: 'Emergency Rental Assistance',
      description: 'Emergency rent and utility assistance',
      eligibility: 'Financial hardship due to COVID-19 or other circumstances',
      website: 'https://home.treasury.gov/policy-issues/coronavirus/assistance-for-state-local-and-tribal-governments/emergency-rental-assistance-program',
    },
    {
      id: 'coc',
      name: 'Continuum of Care (CoC)',
      description: 'Homelessness prevention and assistance',
      eligibility: 'Homeless or at risk of homelessness',
      website: 'https://www.hud.gov/program_offices/comm_planning/coc',
    },
    {
      id: 'rural-housing',
      name: 'Rural Housing Assistance',
      description: 'USDA programs for rural areas (Section 515, 521, 542)',
      eligibility: 'Rural residents, low to moderate income',
      website: 'https://www.rd.usda.gov/programs-services/rental-assistance',
    },
    {
      id: 'property-tax-relief',
      name: 'State Property Tax Relief Programs',
      description: 'Property tax exemptions or deferrals',
      eligibility: 'Varies by state, typically seniors or disabled',
      website: 'Contact your state revenue department',
    }
  ],
  food: [
    {
      id: 'snap',
      name: 'SNAP (Food Stamps)',
      description: 'Monthly benefits for food purchases',
      eligibility: 'Income at or below 130% of Federal Poverty Level',
      website: 'https://www.fns.usda.gov/snap',
    },
    {
      id: 'wic',
      name: 'WIC',
      description: 'Nutrition program for women, infants, and children',
      eligibility: 'Pregnant women, new mothers, infants, children up to age 5',
      website: 'https://www.fns.usda.gov/wic',
    },
    {
      id: 'summer-ebt',
      name: 'Summer EBT / Pandemic EBT',
      description: 'Food benefits for children during summer',
      eligibility: 'Children eligible for free or reduced-price school meals',
      website: 'https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program',
    },
    {
      id: 'csfp',
      name: 'Commodity Supplemental Food Program',
      description: 'Monthly food packages for seniors',
      eligibility: 'Low-income seniors 60+',
      website: 'https://www.fns.usda.gov/csfp',
    },
    {
      id: 'tefap',
      name: 'The Emergency Food Assistance Program',
      description: 'Emergency food assistance',
      eligibility: 'Low-income households',
      website: 'https://www.fns.usda.gov/tefap',
    },
    {
      id: 'seniors-farmers-market',
      name: "Senior Farmers' Market Nutrition Program",
      description: 'Coupons for fresh produce at farmers markets',
      eligibility: 'Low-income seniors 60+',
      website: 'https://www.fns.usda.gov/sfmnp',
    }
  ],
  transportation: [
    {
      id: 'nemt',
      name: 'Non-Emergency Medical Transportation (NEMT)',
      description: 'Transportation to medical appointments through Medicaid',
      eligibility: 'Medicaid beneficiaries',
      website: 'Contact your state Medicaid office',
    },
    {
      id: 'paratransit',
      name: 'Paratransit Services',
      description: 'ADA-mandated accessible transportation',
      eligibility: 'People with disabilities unable to use fixed-route transit',
      website: 'Contact your local transit authority',
    },
    {
      id: 'veterans-transportation',
      name: 'Veterans Transportation Service',
      description: 'Transportation to VA medical facilities',
      eligibility: 'Veterans enrolled in VA health care',
      website: 'https://www.va.gov/healthbenefits/vtp',
    },
    {
      id: 'transit-subsidies',
      name: 'State/Local Transit Fare Subsidy Programs',
      description: 'Reduced-fare transit programs',
      eligibility: 'Varies by location, typically seniors or disabled',
      website: 'Contact your local transit authority',
    },
    {
      id: 'vehicle-modifications',
      name: 'Vehicle Modification Grants',
      description: 'Grants for adaptive equipment',
      eligibility: 'People with disabilities',
      website: 'Various state and nonprofit programs',
    },
    {
      id: 'rural-vouchers',
      name: 'Transportation Vouchers for Rural Areas',
      description: 'Vouchers for rural transportation needs',
      eligibility: 'Rural residents, varies by program',
      website: 'Contact your state rural development office',
    }
  ],
  ssi: [
    {
      id: 'ssi',
      name: 'Supplemental Security Income (SSI)',
      description: 'Monthly payments for aged, blind, or disabled individuals',
      eligibility: 'Limited income and resources, age 65+ or disabled',
      website: 'https://www.ssa.gov/benefits/ssi',
    },
    {
      id: 'ssdi',
      name: 'Social Security Disability Insurance (SSDI)',
      description: 'Benefits for disabled workers',
      eligibility: 'Sufficient work credits and qualifying disability',
      website: 'https://www.ssa.gov/benefits/disability',
    },
    {
      id: 'tanf',
      name: 'TANF',
      description: 'Temporary Assistance for Needy Families',
      eligibility: 'Low-income families with children',
      website: 'https://www.acf.hhs.gov/ofa/programs/tanf',
    },
    {
      id: 'general-assistance',
      name: 'General Assistance',
      description: 'State or local cash support',
      eligibility: 'Varies by state/locality',
      website: 'Contact your state or local social services',
    },
    {
      id: 'eitc',
      name: 'Earned Income Tax Credit (EITC)',
      description: 'Refundable tax credit for working people',
      eligibility: 'Income below threshold, must file tax return',
      website: 'https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit',
    },
    {
      id: 'ctc',
      name: 'Child Tax Credit (CTC)',
      description: 'Tax credit for families with children',
      eligibility: 'Families with qualifying children',
      website: 'https://www.irs.gov/credits-deductions/individuals/child-tax-credit',
    },
    {
      id: 'state-tax-credits',
      name: 'Refundable State Tax Credits',
      description: 'Various state-level tax credits',
      eligibility: 'Varies by state',
      website: 'Contact your state revenue department',
    }
  ]
};

// @route   GET /api/benefits/:category
// @desc    Get benefits by category
// @access  Private
router.get('/:category', protect, async (req, res) => {
  try {
    const { category } = req.params;
    const benefits = benefitsData[category];
    
    if (!benefits) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/benefits/calculate
// @desc    Calculate benefit eligibility
// @access  Private
router.post('/calculate', protect, async (req, res) => {
  try {
    const { type, income, householdSize, state, age, isDisabled, children, filingStatus, fairMarketRent } = req.body;
    
    let result = {};
    
    switch (type) {
      case 'ssi':
        result.amount = calculateSSI(income, state, age, isDisabled);
        break;
      case 'snap':
        result.amount = calculateSNAP(householdSize, income, state);
        break;
      case 'section8':
        result.amount = calculateSection8(income, householdSize, fairMarketRent, state);
        break;
      case 'eitc':
        result.amount = calculateEITC(income, children, filingStatus);
        break;
      case 'medicaid':
        result = calculateMedicaidEligibility(income, householdSize, state, false, isDisabled);
        break;
      default:
        return res.status(400).json({ message: 'Invalid benefit type' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

