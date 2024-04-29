import express from "express";
import cors from "cors";
import { scrapeArticleImg, scrapeArticleBody } from "./scraper.js";

const app = express();
app.use(cors()); // enabling CORS

const port = 3000; // port number

// API route to scrape article thumbnail
app.get("/api/article/img", async(req, res) => {
    const { url } = req.query;

    if (!url) { // if URL arg is not given
        return res.status(400).json({ error : "URL parameter is missing." });
    }

    try {
        // attempt to scrape article thumbnail
        const articleImg = await scrapeArticleImg(url);

        res.json(articleImg);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error : "Could not get article thumbnail." }); // (internal server error)
    }
});

// API route to scrape article body
app.get("/api/article/body", async(req, res) => {
    const { url } = req.query;

    if (!url) { // if URL arg is not given
        return res.status(400).json({ error : "URL parameter is missing." });
    }

    try {
        // attempt to scrape article body
        const childElements = await scrapeArticleBody(url);
        res.json(childElements);
    }
    catch (error) {
        res.status(500).json({ error : "Could not get article body." }); // (internal server error)
    }
});

// Serving static files from a directory
app.use("/images", express.static("C:\\Users\\avij4\\Desktop\\QMUL Archive\\Final Year Project\\ai-news-platform\\static\\"));


// start server on port 3000
app.listen(port, _ => {
    console.log(`Server is running on port ${port}`);
});