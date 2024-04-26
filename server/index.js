import express from "express";
import cors from "cors";


const app = express();
app.use(cors()); // enabling CORS

const port = 3000;


app.get("/api/article/img", async(req, res) => {
    const url = req.query;

    if (!url) { // if URL arg is not given
        return res.status(400).json({ error : "URL parameter is missing." });
    }

    try {
        const articleImg = await scrapeArticleImg(url);
        res.json(articleImg);
    }
    catch (error) {
        res.status(500).json({ error : "Could not get article thumbnail." });
    }
});

app.get("/api/article/body", async(req, res) => {
    const url = req.query;

    if (!url) { // if URL arg is not given
        return res.status(400).json({ error : "URL parameter is missing." });
    }

    try {
        const childElements = await scrapeArticleBody(url);
        res.json(childElements);
    }
    catch (error) {
        res.status(500).json({ error : "Could not get article body." });
    }
});

// start server
app.listen(port, _ => {
    console.log(`Server is running on port ${port}`);
});