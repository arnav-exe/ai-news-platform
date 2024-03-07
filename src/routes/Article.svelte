<script>
    import { onMount } from "svelte";
    import { Drawer, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';

    import json from './data.json'
    import { articleScrape } from "./scaper.js"

    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;
    
    export let articles = [];

    onMount(async _ => {
        // const response = await fetch(url);
        // let json = await response.json();

        articles = json["articles"]; // uses dummy data imported from "data.json"
    
        articleScrape(); // NOT WORKING RN
    });

    initializeStores();
    const drawerStore = getDrawerStore();

    export let drawerSettings = {};

    const openArticle = _ => {
        const drawerSettings = {
            position: "bottom",
            height: "h-[90vh]", //90%vh
            meta: {articleTitle: "hello", articleSummary: " world"}
        }
        drawerStore.open(drawerSettings);
    }
</script>

<div class="container">
    



    <button on:click={openArticle}>CLICK ME
        <Drawer>
            <!-- <div class="container h-full mx-auto flex p-1">
                <h3 class="h3">{article.title}</h3>
                <img src="{article.urlToImage}" alt="article thumbnail">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ullam enim quasi id in explicabo quas! Quae saepe illum neque odio vel sit odit non, similique necessitatibus repellat qui veritatis.</p>
            </div> -->
            <div>{$drawerStore["meta"]["articleTitle"]}</div>
        </Drawer>
        </button>



    {#each articles as article}
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
{/each}

</div>