import express from 'express';
import { protect } from '../middleware/auth.js';
import axios from 'axios';
import VoiceIntent from '../models/VoiceIntent.js';

const router = express.Router();

// Using Gemini via REST (axios)

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
    
    const allowedIntents = [
      // Navigation
      'navigate_dashboard','open_dashboard','back_home',
      'navigate_profile','open_profile',
      'navigate_onboarding','start_onboarding','resume_onboarding',
      'navigate_healthcare','check_healthcare','check_medicaid','check_medicare','open_healthcare',
      'navigate_housing','check_housing','open_housing',
      'navigate_food','check_food','check_snap','open_food',
      'navigate_transportation','check_transportation','open_transportation',
      'navigate_ssi','check_ssi','check_ssdi','open_ssi',

      // Accessibility panel
      'open_accessibility_panel','close_accessibility_panel',
      'toggle_narration_on','toggle_narration_off',
      'increase_font_size','decrease_font_size','set_font_size_small','set_font_size_medium','set_font_size_large',
      'enable_high_contrast','disable_high_contrast',
      'enable_dyslexia_font','disable_dyslexia_font',
      'set_color_filter_none','set_color_filter_protanopia','set_color_filter_deuteranopia','set_color_filter_tritanopia',

      // Profile updates
      'open_location_settings','update_location_city','update_location_state',
      'open_language_settings','change_language_en','change_language_es','change_language_fr','change_language_zh','change_language_hi','change_language_tl','change_language_vi',

      // Benefits overview & actions
      'open_benefits_overview','check_all_benefits','estimate_transportation_benefit','estimate_food_benefit','estimate_housing_benefit','estimate_healthcare_benefit',

      // Alerts & help
      'open_alerts','close_alerts','help','contact_support','what_can_i_say',

      // App controls
      'open_voice','close_voice','log_out','open_profile_settings','save_settings',

      // Misc
      'scroll_left','scroll_right','go_back','go_forward'
    ];

    const systemPrompt = `You classify short voice commands into a strict whitelist of intents for a benefits app.\n\nRules:\n- Only output JSON.\n- Map to one intent from the whitelist when clearly implied.\n- If unclear or no match, return intent:null and confidence:0.\n- Prefer 'check_*' when the user asks to check or see eligibility/amounts.\n\nAllowed intents: ${allowedIntents.join(', ')}`;
    const prompt = `${systemPrompt}\n\nUser command: "${transcript}"\n\nReturn JSON as {"intent": string|null, "confidence": number, "parameters": {}}`;

    // Call Gemini 2.5 Flash via REST
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const { data } = await axios.post(url, {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response
    let intent;
    try {
      intent = JSON.parse(text);
      if (intent && intent.intent && !allowedIntents.includes(intent.intent)) {
        intent.intent = null;
        intent.confidence = 0;
      }
    } catch (_) {
      intent = { intent: null, confidence: 0, parameters: {} };
    }
    
    // Save intent to database
    try {
      await VoiceIntent.create({
        userId: req.user._id,
        transcript,
        classifiedIntent: intent.intent,
        confidence: intent.confidence,
      });
    } catch (e) {
      // non-blocking
    }
    
    res.json(intent);
  } catch (error) {
    console.error('Intent classification error:', error);
    res.status(500).json({ message: 'Intent classification failed', error: error.message });
  }
});

export default router;

