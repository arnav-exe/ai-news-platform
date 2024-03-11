import express from "express";
import scrapeArticle from "./scraper.js";

const app = express();
const port = 3000;

app.get("/api/article", async(req, res) => {
    try {
        const articleData = await scrapeArticle();
        res.json(articleData);
    }
    catch (error) {
        res.status(500).json({error: "Could not get article body"});
    }
});

app.listen(port, _ => {
    console.log(`Server is running on port ${port}`);
});



/*
TODO:
1. enable CORS
2. write image scraper
3. add firebase backend
*/