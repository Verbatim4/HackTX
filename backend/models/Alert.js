import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  type: { type: String, enum: ['income_change', 'rule_update', 'benefit_adjustment'] },
  impactValue: { type: Number, default: 0 },
  dateIssued: { type: Date, default: Date.now },
  viewed: { type: Boolean, default: false }
});

export default mongoose.model('Alert', AlertSchema);

