import puppeteer from "puppeteer";

const scrapeArticle = async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // random article link for testing
    await page.goto(url);

    let childElements = await page.evaluate(_ => {
        const elements = Array.from(document.querySelectorAll('[data-component="text-block"]'));

        return elements.map(e => e.innerText);
    })
    await browser.close();

    return childElements;
}

// export default scrapeArticle;
export default async (req, res) => {
    const { url } = req.query;
    const articleData = await scrapeArticle(url);
    res.status(200).json(articleData);
}