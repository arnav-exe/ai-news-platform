<script>
    import { onMount } from "svelte";
    import { Drawer, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';

    import json from './data.json';
    import { response } from "express";

    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;
    
    let articleBody = "";
    let articles;

    const fetchArticleData = async _ => {
        try {
            const res = await fetch("http://localhost:3000/api/article");
            
            if (!res.ok) { // if fails to fetch from endpoint
                throw new Error("Failed to fetch article data");
            }
            else {
                const data = await response.json();
                articleBody = data.join("\n");
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    onMount(async _ => {
        articles = json["articles"]; // dummy data imported from "data.json"
        
        fetchArticleData();
    });

    initializeStores();
    const drawerStore = getDrawerStore();

    const openArticle = article => { // pass article data as a parameter
        articleBody = articleScrape();

        const drawerSettings = {
            position: "bottom",
            height: "h-[90vh]", //90%vh
            meta: { articleTitle: article.title, articleSummary: articleBody } // Use article data here
        };

        drawerStore.open(drawerSettings);
    }
</script>

<div class="container">
    <!-- article drawer -->
    <Drawer>
        <div class="p-4">
            <h1 class="h1">{$drawerStore["meta"]["articleTitle"]}</h1>
            <p>{$drawerStore["meta"]["articleSummary"]}</p>
        </div>
    </Drawer>

    <!-- article cards -->
    <div class="grid justify-items-center items-center">
        {#each articles as article} <!-- keyed each block to differentiate article data -->
        <button on:click={_ => openArticle(article)}> <!-- Pass article data to openArticle function -->
            <div class="card card-hover overflow-hidden m-8">
                <header>
                    <img src="{article.urlToImage}" class="bg-black/50 w-full aspect-[21/9]" alt="article thumbnail" />
                </header>
                <div class="p-4 space-y-4">
                    <img src="../../../bbc.png" class="max-w-12 h-auto" alt="BBC">
                    <h3 class="h3" data-toc-ignore>{article.title}</h3>
                </div>
                <hr class="opacity-50" />
                <footer class="p-4 flex justify-start items-center space-x-4">
                    <div class="flex-auto flex justify-between items-center">
                        <h6 class="font-bold" data-toc-ignore>By {article.author}</h6>
                        <small>Published: {article.publishedAt.slice(0, 10)}</small>
                    </div>
                </footer>
            </div>
        </button>
        {/each}
    </div>
</div>
