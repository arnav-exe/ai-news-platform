<script>
    import { onMount } from "svelte";
    import { Drawer, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';

    import json from './data.json';

    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    const API_URL = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${API_KEY}`;
    
    let articles = [];

    let articleThumbnails = {}; // store article thumbnail URLs (with ID so they can be appropriately referenced)
    let articleBody; // article body



    const fetchArticleImg = async url => { // fetch article thumbnail from pptr webscraper
        try {
            const res = await fetch(`http://localhost:3000/api/article/img?url=${encodeURIComponent(url)}`);
            
            if (!res.ok) { // if fails to fetch from endpoint
                throw new Error("Failed to fetch article thumbnail. Please reload the page and try again.");
            }
            else { // if succeed
                const data = await res.json();
                articleThumbnails[url] = data;
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const fetchArticleBody = async url => { // fetch article data from pptr webscraper
        try {
            const res = await fetch(`http://localhost:3000/api/article/body?url=${encodeURIComponent(url)}`);
            
            if (!res.ok) { // if fails to fetch from endpoint
                throw new Error("Failed to fetch article body. Please reload the page and try again.");
            }
            else { // if succeed
                const data = await res.json();

                articleBody = await summarize(data.join("\n"));
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const articleFetchButtonHandler = async url => {
        fetchArticleBody(url);
    }

    const fetchArticles = async _ => {
        try {
            let articleRes = await fetch(API_URL)
            if (!articleRes.ok) {
                throw new Error("Failed to fetch data.");
            }
            articles = await articleRes.json();
        }
        catch (error) {
            console.log("Error. Failed to fetch articles from NewsAPI:", error)
        }
    }

    onMount(async _ => {

        // SCRAPE FROM API_URL HERE INSTEAD OF CALLING FROM DATA.JSON
        // CODE HERE
        await fetchArticles();
        if (!articles) {
            console.log("Error. no articles fetched.")
        }
        console.log(articles.articles)
        

        // loop through articles to get thumbnails for all null values
        for (const article of articles.articles) {
            if (!articles.articles.urlToImage) {
                await fetchArticleImg(article.url);
            }
        }
    });


    // calling facebook/bart-large-cnn from huggingface inference API
    const query = async data => {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
                headers: { Authorization: "Bearer " + import.meta.env.VITE_HF_KEY },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    }

    const summarize = async body => {
        if (body) {
            query({"inputs": body}).then((response) => {
                articleBody = response[0].summary_text;

                return;
            });
        }
    }



    initializeStores();
    let drawerStore = getDrawerStore();

    const openArticle = article => { // pass article data as a parameter
        const drawerSettings = {
            position: "bottom",
            height: "h-[90vh]", //90% of vh
            meta: {
                articleTitle: article.title, // store article header (for displaying on main page)
                articleURL: article.url // store article URL (for displaying link to original inside article slider)
            }
        };

        drawerStore.open(drawerSettings);
    }
</script>

<div class="container">
    <!-- article drawer -->
    <Drawer>
        <div class="p-4">
            <h1 class="h1 p-10">{$drawerStore.meta.articleTitle}</h1>
            {#if !articleBody}
                <section class="card w-full">
                    <div class="p-4 space-y-4">
                        {#each {length: 10} as _}
                            <div class="placeholder animate-pulse" />
                        {/each}
                    </div>
                </section>
            {:else}
                <p>{articleBody}</p>
                <br>
                <a href="{$drawerStore.meta.articleURL}" class="variant-soft-secondary bg-transparent underline">Link to the original article -&gt;</a>
            {/if}
        </div>
    </Drawer>
    
    <!-- article cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 m-8 justify-items-center items-center">
        {#if articles.articles && articles.articles.length > 0}
            {#each articles.articles as article}
            <button on:click={_ => {articleFetchButtonHandler(article.url); openArticle(article)}}> <!-- Pass article data to openArticle function -->
                <div class="card card-hover overflow-hidden max-w-2xl aspect-auto">
                    <header>
                        {#if !article.urlToImage}
                            <img src="{articleThumbnails[article.url]}" class="bg-black/50 w-full height-auto aspect-[16/9]" alt="article thumbnail" />
                        {:else}
                            <img src="{article.urlToImage}" class="bg-black/50 w-full height-auto aspect-[16/9]" alt="article thumbnail" />
                        {/if}
                    </header>
                    <div class="p-4 space-y-4">
                        {#if article.source.name}
                            <img src="../../{article.source.name}.png" class="max-w-12 h-auto" alt="{article.source.name}">
                        {/if}
                        <h3 class="h3 text-left" data-toc-ignore>{article.title}</h3>
                    </div>
                    <hr class="opacity-50" />
                    <footer class="p-4 flex justify-start items-center space-x-4">
                        <div class="flex-auto flex justify-between items-center">
                            <small data-toc-ignore>By: {article.source.name}</small>
                            <small>Published: {article.publishedAt.slice(0, 10)}</small>
                        </div>
                    </footer>
                </div>
            </button>
            {/each}
        {:else}
        <p>LOADING...</p>
        {/if}
    </div>
</div>