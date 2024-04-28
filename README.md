# AI News Platform

### Tech Stack:
 * Svelte
 * SkeletonUI
 * Tailwind
 * Firebase
 * ExpressJS
 * Puppeteer with Node
 * Vite


### TODO:
 * make all anchor tags darker shade of blue on mouse press down
 * find a way to change config of facebook NLP model
 * include supplementary images in articles?
 * remove news source name from articles.articles.title (basically search string starting at end, and once " - " is detected, remove that and everything after)
 * reflect changes made to user preferences in newsAPI call
 * add options to filter language, date
 * add next page button to load additional articles
 * add sort by relevancy, popularity, and publishedAt
 * look into using EITHER [async library](https://github.com/caolan/async) OR [web workers](https://www.npmjs.com/package/webworker-threads) to parallel process the _for loop_ that gets the article thumbnails
 * **COMMENT EVERYTHING**