import puppeteer from "puppeteer";

const scrapeArticleBody = async url => {
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

const scrapeArticleImg = async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(decodeURIComponent(url));

    // wait for img to load
    await page.waitForSelector("img");

    let articleImg = await page.evaluate(_ => {
        const img = document.querySelector("img"); // scrapes src of first img tag

        return img ? img.src : null;
    })
    
    await browser.close();

    return articleImg;
}

export default { scrapeArticleBody, scrapeArticleImg };