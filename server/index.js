import { express } from "express";
import articleScrape, { scrapeArticle } from "./scraper";

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