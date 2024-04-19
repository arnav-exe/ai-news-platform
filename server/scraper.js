import puppeteer from "puppeteer";

const scrapeArticle = async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(decodeURIComponent(url));

    let childElements = await page.evaluate(_ => {
        const elements = Array.from(document.querySelectorAll('[data-component="text-block"]'));

        return elements.map(e => e.innerText);
    })
    await browser.close();

    return childElements;
}

export default scrapeArticle;