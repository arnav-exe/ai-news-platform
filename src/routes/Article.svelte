<script>
    import { onMount } from "svelte";
    import { Drawer, getDrawerStore, initializeStores, ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
    import { authHandlers, authStore } from "../store/store";


    initializeStores();
    const toastStore = getToastStore();
    const toastData = {
        message: 'Updated successfully!',
        timeout: 5000,
        background: 'variant-filled-success'
    };

    let categories = {};
    let selectedCategory; // default category if user is NOT logged in
    $: API_URL = (selectedCategory ? `https://saurav.tech/NewsAPI/top-headlines/category/${selectedCategory}/gb.json` : `https://saurav.tech/NewsAPI/top-headlines/category/general/gb.json`);

    $: {
        if (API_URL) {
            (async () => {
                await fetchArticles();
            })();
        }
    }

    

    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
    
    let articles = [];

    let articleThumbnails = {}; // store article thumbnail URLs (with ID so they can be appropriately referenced)
    let articleBody; // article body



    const fetchArticleImg = async url => { // fetch article thumbnail from pptr webscraper
        try {
            const res = await fetch(`http://localhost:3000/api/article/img?url=${encodeURIComponent(url)}`);
            
            if (!res.ok) { // if fails to fetch from endpoint
                // throw new Error("Failed to fetch article thumbnail. Please reload the page and try again.");
                articleThumbnails[url] = "http://localhost:3000/images/placeholder.png";
            }
            else { // if succeed
                const data = await res.json();
                articleThumbnails[url] = data;
            }
        }
        catch (error) {
            articleThumbnails[url] = "http://localhost:3000/images/placeholder.png";
            console.error(error);
        }
    }

    const fetchArticleBody = async url => { // fetch article data from pptr webscraper
        articleBody = "";
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



    const saveCategories = async _ => {
        toastStore.trigger(toastData);

        for (const key in categories) {
            if (Object.hasOwnProperty.call(categories, key)) {
                categories[key] = false;
            }
        }
        categories[selectedCategory] = true;

        await authHandlers.updatePrefs(categories);
    }


    onMount(async _ => {

        authStore.subscribe(curr => {
            categories = curr.newsPrefs;

            for (const key in categories) {
                if (categories[key] === true) {
                    selectedCategory = key;
                    console.log(categories)
                }
            }
        });

        // fetching articles
        await fetchArticles();
        if (!articles) {
            console.log("Error. no articles fetched.")
        }

        // loop through articles to get thumbnails for all null values
        for (const article of articles.articles) {
            if (!articles.articles.urlToImage) {
                await fetchArticleImg(article.url);
            }
        }
    });


    
    // format article title
    const removeTrail = str => {
        const i = str.lastIndexOf(" - ");
        if (i !== -1) {
            return str.slice(0, i)
        }
        return str;
    }

    // calling facebook/bart-large-cnn from huggingface inference API
    const query = async data => {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: { Authorization: "Bearer " + import.meta.env.VITE_HF_KEY },
                    maxBodyLength: Infinity,
                    method: "POST",
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }

    const summarize = async body => {
        if (body) {
            query({"inputs": body}).then((response) => {
                articleBody = response[0].summary_text;

                return;
            });
        }
    }

    const fetchArticleLogo = async img => {
        img = img.replace(" ", "%20");
        let imgPath = `http://localhost:3000/images/${img}.png`;

        try {
            const res = await fetch(imgPath);
            if (!res.ok) {
                throw new Error("Failed to fetch article logo.");
            }
            return imgPath; // Return the image URL if it exists
        } catch (error) {
            console.error("Error fetching article logo:", error);
            // If fetch fails, return the URL of the default image
            return "http://localhost:3000/images/src.png";
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
    

    <!-- news category selectors -->
    {#if categories}
        <div class="flex justify-center flex-1">
            {#each Object.keys(categories) as c}
                <button
                    class="chip {selectedCategory === c ? 'variant-filled' : 'variant-soft'} m-2"
                    on:click={() => { selectedCategory = c; saveCategories()}}
                    on:keypress
                >
                    {#if selectedCategory === c}<span>✓</span>{/if}
                    <span class="capitalize">{c}</span>
                </button>
            {/each}
        </div>
    {/if}



    <!-- article cards -->
    {#key API_URL}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 m-8 justify-items-center items-center">
        {#if articles.articles && articles.articles.length > 0}
            {#each articles.articles as article}
            <button on:click={_ => {articleFetchButtonHandler(article.url); openArticle(article)}}> <!-- Pass article data to openArticle function -->
                <div class="card card-hover overflow-hidden max-w-2xl aspect-auto">
                    <header>
                        {#if !article.urlToImage}
                            <img src="{articleThumbnails[article.url]}" class="bg-black/50 w-full height-auto aspect-[16/9]" alt="article thumbnail" on:error={e => {e.target.src = "http://localhost:3000/images/placeholder.png"}} />
                        {:else}
                            <img src="{article.urlToImage}" class="bg-black/50 w-full height-auto aspect-[16/9]" alt="article thumbnail" />
                        {/if}
                    </header>
                    <div class="p-4 space-y-4">
                        {#if article.source.name}
                            {#await fetchArticleLogo(article.source.name)}
                                <img src="http://localhost:3000/images/src.png" class="max-w-8 h-auto" alt="{article.source.name}">
                            {:then logoUrl}
                                <img src={logoUrl} class="max-w-8 h-auto" alt="{article.source.name}">
                            {:catch}
                                <img src="http://localhost:3000/images/src.png" class="max-w-8 h-auto" alt="{article.source.name}">
                            {/await}
                        {/if}
                        <h3 class="h3 text-left" data-toc-ignore>{removeTrail(article.title)}</h3>
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
        <div />
		<ProgressRadial width="w-10" />

        {/if}
    </div>
    {/key}
</div>