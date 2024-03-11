import puppeteer from "puppeteer";

const scrapeArticle = async _ => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // random article link for testing
    await page.goto("https://www.bbc.com/news/entertainment-arts-68415018");

    let childElements = await page.evaluate(_ => {
        const elements = Array.from(document.querySelectorAll('[data-component="text-block"]'));

        return elements.map(e => e.innerText);
    })
    await browser.close();

    return childElements;
}

export default scrapeArticle;