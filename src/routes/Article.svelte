<script>
    import { onMount } from "svelte";

    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;
    
    let articles = [];

    onMount(async _ => {
        const response = await fetch(url);
        const json = await response.json();
        articles = json["articles"];

        console.table(articles)
    });
</script>

{#each articles as article}
    <!-- <a class="card card-hover overflow-hidden" href="{article.url}">
		<header>
			<img src="{article.urlToImage}" class="bg-black/50 w-full aspect-[21/9]" alt="article thumbnail" />
		</header>
		<div class="p-4 space-y-4">
			<img src="../../../bbc.png" class="max-w-12 h-auto" alt="BBC">
			<h3 class="h3" data-toc-ignore>{article.title}</h3>
			<article>
				<p>{article.description}</p>
			</article>
		</div>
		<hr class="opacity-50" />
		<footer class="p-4 flex justify-start items-center space-x-4">
			<div class="flex-auto flex justify-between items-center">
				<h6 class="font-bold" data-toc-ignore>By {article.author}</h6>
				<small>Published: {article.publishedAt.slice(0, 10)}</small>
			</div>
		</footer>
	</a> -->

    <img src="{article.urlToImage}" alt="article thumbnail">
{/each}