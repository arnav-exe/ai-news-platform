import NewsAPI from "newsapi";

const newsapi = new NewsAPI(import.meta.env.VITE_NEWSAPI_KEY);

newsapi.v2.topHeadlines({
    sources: 'bbc-news,the-verge',
    q: 'bitcoin',
    category: 'business',
    language: 'en',
    country: 'us'
  }).then(response => {
    console.log(response);
  });