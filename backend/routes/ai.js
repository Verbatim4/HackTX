import express from 'express';
import { protect } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import VoiceIntent from '../models/VoiceIntent.js';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

// @route   POST /api/ai/classify-intent
// @desc    Classify user intent from transcript
// @access  Private
router.post('/classify-intent', protect, async (req, res) => {
  try {
    const { transcript } = req.body;
    
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('⚠️  Gemini API key not configured, using fallback intent classification');
      // Simple fallback intent classification
      const lowerTranscript = transcript.toLowerCase();
      let intent = 'get_help';
      
      if (lowerTranscript.includes('healthcare') || lowerTranscript.includes('medicaid') || lowerTranscript.includes('medicare')) {
        intent = 'navigate_healthcare';
      } else if (lowerTranscript.includes('housing') || lowerTranscript.includes('section 8')) {
        intent = 'navigate_housing';
      } else if (lowerTranscript.includes('food') || lowerTranscript.includes('snap')) {
        intent = 'navigate_food';
      } else if (lowerTranscript.includes('transport')) {
        intent = 'navigate_transportation';
      } else if (lowerTranscript.includes('ssi') || lowerTranscript.includes('social security')) {
        intent = 'navigate_ssi';
      } else if (lowerTranscript.includes('profile')) {
        intent = 'navigate_profile';
      }
      
      return res.json({ intent, confidence: 0.8, parameters: {} });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are an AI assistant for Polara, a government benefits platform. 
    Analyze the following user command and classify the intent. 
    
    Available intents:
    - navigate_healthcare OR check_healthcare OR check_medicaid OR check_medicare: User asks about healthcare, Medicaid, Medicare, or medical benefits
    - navigate_housing OR check_housing: User asks about housing, rent assistance, Section 8
    - navigate_food OR check_food OR check_snap: User asks about food benefits, SNAP, food stamps, WIC
    - navigate_transportation OR check_transportation: User asks about transportation benefits
    - navigate_ssi OR check_ssi OR check_ssdi: User asks about SSI, SSDI, Social Security, disability payments, tax credits
    - navigate_profile: User wants to see their profile or settings
    - calculate_benefit: User wants to calculate a specific benefit amount
    - get_help: User needs help or explanation
    - change_language: User wants to change language
    - adjust_accessibility: User wants to adjust accessibility settings
    
    User command: "${transcript}"
    
    IMPORTANT: If the user asks to "check" or asks "what is" about a specific benefit (like "check my medicaid" or "what is my SNAP eligibility"), 
    use the corresponding "check_" intent (e.g., check_medicaid, check_snap).
    
    Respond with ONLY a JSON object in this format:
    {
      "intent": "the_intent_name",
      "confidence": 0.95,
      "parameters": {}
    }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const intent = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      intent: 'get_help',
      confidence: 0.5,
      parameters: {}
    };
    
    // Save intent to database
    await VoiceIntent.create({
      userId: req.user._id,
      transcript,
      classifiedIntent: intent.intent,
      confidence: intent.confidence,
    });
    
    res.json(intent);
  } catch (error) {
    console.error('Intent classification error:', error);
    res.status(500).json({ message: 'Intent classification failed', error: error.message });
  }
});

export default router;

