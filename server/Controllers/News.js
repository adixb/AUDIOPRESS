const dotenv = require('dotenv');
const LRUCache = require('../Utils/LRUCache');

dotenv.config();

const cache = new LRUCache(100); 


//FETCHING NEWS FROM NEWS API 
async function handleFetchNews(req, res) {
    const { filterCategory, filterCountry } = req.body;
    const cacheKey = `${filterCategory}_${filterCountry}`;

    // Check if the data is already in the cache
    const cachedData = cache.get(cacheKey);
    if (cachedData !== -1) { // cache hit, data found
        return res.status(200).json(cachedData);
    }

    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${filterCountry}&category=${filterCategory}&apiKey=${process.env.NEWS_API_KEY}`);

        if (response.ok) {
            const data = await response.json();
            // Store the data in the cache
            cache.put(cacheKey, data);
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: `Error fetching news: ${response.statusText}` });
        }
    } catch (err) {
        res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
}


module.exports = {
    handleFetchNews,
    

};
