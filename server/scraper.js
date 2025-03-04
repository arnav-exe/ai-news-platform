import puppeteer from "puppeteer";

// scrapes img src from article
const scrapeArticleImg = async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(decodeURIComponent(url));

    // wait for img to load
    await page.waitForSelector("img");

    let articleImg = await page.evaluate(() => {
        const img = document.querySelector("img"); // selects first img element

        // return img src (if img exists, else return null)
        return img ? img.src : null;
    })
    
    // close browser (prevent memory leaks)
    await browser.close();

    return articleImg;
}

// scrapes article body from article
const scrapeArticleBody = async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(decodeURIComponent(url));

    // wait for p elements to load
    await page.waitForSelector("p");
    
    let childElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('p')); // selects all paragraph elements

        // return innerText of each paragraph element
        return elements.map(e => e.innerText);
    })

    await browser.close(); // close browser (prevent memory leaks)

    return childElements;
}

// export functions for access in index.js
export { scrapeArticleImg, scrapeArticleBody };