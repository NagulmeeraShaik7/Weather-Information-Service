import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  description: { type: String, required: true },
  humidity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Weather', weatherSchema);