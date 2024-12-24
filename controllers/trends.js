import NewTrends from "../models/trends.js";

export const getTrends =async(req,res)=>{
    const { limit = 5 } = req.query;

    try {
        const trendingTopics = await NewTrends.find()
        .sort({ lastUpdated: -1 })
        .limit(Number(limit));

        res.json(trendingTopics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}