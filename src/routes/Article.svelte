<script>
    import { onMount } from "svelte";
    import { Drawer, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';
    import Page from "./+page.svelte";

    import json from './data.json'

    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;
    
    let articles = [];

    onMount(async _ => {
        // const response = await fetch(url);
        // let json = await response.json();

        articles = json["articles"]; // uses dummy data imported from "data.json"
    });

    initializeStores();
    const drawerStore = getDrawerStore();

    const drawerSettings = {
        position: "bottom",
        height: "h-4/5", //80%vh
        meta: {hello: "world"}
    }


    const openDrawer = _ => {
        drawerStore.open(drawerSettings);
    }
</script>

<Drawer />

{#each articles as article}
    <button style="all:unset" on:click={openDrawer}> {$drawerStore.meta}
    <div class="card card-hover overflow-hidden">
    <!-- <a class="card card-hover overflow-hidden" href="{article.url}"> -->
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
	<!-- </a> -->
</div>
</button>

    <!-- <img src="{article.urlToImage}" alt="article thumbnail"> -->
{/each}