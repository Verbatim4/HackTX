import express from 'express';
import { protect } from '../middleware/auth.js';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

// @route   POST /api/voice/transcribe
// @desc    Transcribe speech to text using Eleven Labs
// @access  Private
router.post('/transcribe', protect, async (req, res) => {
  try {
    const { audioData } = req.body;
    
    // Eleven Labs Speech-to-Text API
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/speech-to-text',
      {
        audio: audioData,
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    res.json({
      transcript: response.data.text,
      confidence: response.data.confidence || 1.0,
    });
  } catch (error) {
    console.error('Transcription error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Transcription failed', error: error.message });
  }
});

// @route   POST /api/voice/narrate
// @desc    Generate speech from text using Eleven Labs
// @access  Private
router.post('/narrate', protect, async (req, res) => {
  try {
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL', language = 'en' } = req.body;
    
    // Eleven Labs Text-to-Speech API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );
    
    // Convert audio buffer to base64
    const audioBase64 = Buffer.from(response.data).toString('base64');
    
    res.json({
      audio: audioBase64,
      format: 'mp3',
    });
  } catch (error) {
    console.error('Narration error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Narration failed', error: error.message });
  }
});

// @route   POST /api/voice/narrate-page
// @desc    Generate narration for a page using Gemini AI and convert to speech
// @access  Private
router.post('/narrate-page', protect, async (req, res) => {
  try {
    const { page, pageData } = req.body;
    
    // Fallback narration text if Gemini API not available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('⚠️  Gemini API key not configured, using fallback narration');
      const fallbackTexts = {
        home: 'Welcome to Polara, your financial north star. We help you discover and optimize government benefits.',
        dashboard: 'You are viewing the Polara dashboard. Click on any planet to explore healthcare, housing, food, or transportation benefits. The sun in the center represents Social Security and tax programs.',
        healthcare: 'This page shows healthcare benefits including Medicaid, Medicare, and other health programs. Review each program to see your eligibility.',
        housing: 'This page shows housing assistance programs including Section 8, public housing, and energy assistance. Check which programs you qualify for.',
        food: 'This page shows food and nutrition assistance programs including SNAP and WIC. See which programs can help you.',
        transportation: 'This page shows transportation assistance programs. Contact your local transit authority for more information.',
        ssi: 'This page shows Social Security Income, disability benefits, and tax credits. Use the calculator to estimate your benefits.',
        profile: 'Adjust your profile settings, language preferences, and accessibility options here.'
      };
      
      const narrationText = fallbackTexts[page] || `You are viewing the ${page} page.`;
      
      // Return just text, skip Eleven Labs TTS if key not available
      return res.json({
        text: narrationText,
        audio: null,
        format: 'text-only'
      });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompts = {
      home: `Generate a warm, welcoming narration for the Polara home page. Explain that Polara is a platform that helps users find and optimize government benefits. Keep it under 2 sentences and friendly.`,
      dashboard: `Generate a narration for the Polara dashboard. Explain that the user is viewing a solar system where each planet represents a different benefit category: Healthcare, Housing, Food, Transportation, and the Sun represents Social Security and taxes. Tell them to click on any planet to explore benefits. Keep it under 3 sentences.`,
      healthcare: `Generate a brief narration about the healthcare benefits page. Mention that this page shows various healthcare programs like Medicaid, Medicare, and others. Encourage the user to review their eligibility. Keep it under 2 sentences.`,
      housing: `Generate a brief narration about the housing benefits page. Mention programs like Section 8 and rental assistance. Keep it under 2 sentences.`,
      food: `Generate a brief narration about the food benefits page. Mention SNAP and other nutrition programs. Keep it under 2 sentences.`,
      transportation: `Generate a brief narration about transportation benefits. Mention various transportation assistance programs. Keep it under 2 sentences.`,
      ssi: `Generate a brief narration about the SSI and tax benefits page. Mention Social Security Income, disability benefits, and tax credits like EITC. Keep it under 2 sentences.`,
      profile: `Generate a brief narration for the profile settings page. Mention that users can adjust their language, accessibility settings, and personal information here. Keep it under 2 sentences.`
    };
    
    const prompt = prompts[page] || `Generate a brief, helpful narration for the ${page} page of Polara, a government benefits platform. Keep it under 2 sentences.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const narrationText = response.text();
    
    // Now convert to speech using Eleven Labs
    const voiceResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`,
      {
        text: narrationText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );
    
    const audioBase64 = Buffer.from(voiceResponse.data).toString('base64');
    
    res.json({
      text: narrationText,
      audio: audioBase64,
      format: 'mp3',
    });
  } catch (error) {
    console.error('Narration error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Narration failed', error: error.message });
  }
});

export default router;

