import mongoose from 'mongoose';

const VoiceIntentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transcript: { type: String, required: true },
  classifiedIntent: { type: String, required: true },
  confidence: { type: Number, default: 1.0 },
  executedAction: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('VoiceIntent', VoiceIntentSchema);

