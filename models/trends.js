import mongoose from "mongoose";

const TrendingTopicSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    type: { type: String, required: true },
    count: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  });


const NewTrends = mongoose.model('Trends', TrendingTopicSchema);
export default NewTrends;