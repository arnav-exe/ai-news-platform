import express from "express";
import cors from "cors";
import scrapeArticle from "./scraper.js";

const app = express();
app.use(cors()); // enabling CORS

const port = 3000;


app.get("/api/article", async(req, res) => {
    const { url } = req.query;

    if (!url) { // if URL arg is not given
        return res.status(400).json({ error : "URL parameter is missing." });
    }

    try {
        const articleData = await scrapeArticle(url);
        res.json(articleData);
    }
    catch (error) {
        res.status(500).json({ error : "Could not get article body." });
    }
});

app.listen(port, _ => {
    console.log(`Server is running on port ${port}`);
});
