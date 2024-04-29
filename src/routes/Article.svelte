<script>
    import { onMount } from "svelte";
    import { Drawer, getDrawerStore, initializeStores, ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';
    import { authHandlers, authStore } from "../store/store";


    // init stores
    initializeStores();

    const toastStore = getToastStore();
    
    // toast noti config
    const toastData = {
        message: 'Updated successfully!',
        timeout: 5000,
        background: 'variant-filled-success'
    };

    let categories = {};
    let selectedCategory;
    
    // API URL based on if a category has value
    $: API_URL = (selectedCategory ? `https://saurav.tech/NewsAPI/top-headlines/category/${selectedCategory}/gb.json` : `https://saurav.tech/NewsAPI/top-headlines/category/general/gb.json`);

    // re-fetch articles when category changes (dynamically updates)
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


    // fetch article thumbnail from backend
    const fetchArticleImg = async url => {
        try {
            const res = await fetch(`http://localhost:3000/api/article/img?url=${encodeURIComponent(url)}`);
            
            // if fails to fetch from endpoint (use placeholder)
            if (!res.ok) {
                articleThumbnails[url] = "http://localhost:3000/images/placeholder.png";
            }
            else { // if succeeds
                const data = await res.json();
                articleThumbnails[url] = data;
            }
        }
        catch (error) { // if fails to fetch from endpoint (use placeholder)
            articleThumbnails[url] = "http://localhost:3000/images/placeholder.png";
            console.error(error);
        }
    }

    // fetch article body from backend
    const fetchArticleBody = async url => {
        articleBody = "";
        try {
            const res = await fetch(`http://localhost:3000/api/article/body?url=${encodeURIComponent(url)}`);
            
            if (!res.ok) { // if fails to fetch from endpoint
                throw new Error("Failed to fetch article body. Please reload the page and try again.");
            }
            else { // if succeed
                const data = await res.json();

                // pass through summarizer
                articleBody = await summarize(data.join("\n"));
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    // button handler for fetching article body
    const articleFetchButtonHandler = async url => {
        fetchArticleBody(url);
    }

    // fetch articles from NewsAPI
    const fetchArticles = async _ => {
        try {
            let articleRes = await fetch(API_URL)
            if (!articleRes.ok) { // if return API error
                throw new Error("Failed to fetch data.");
            }
            // if succeeds
            articles = await articleRes.json();
        }
        catch (error) { // if fails
            console.log("Error. Failed to fetch articles from NewsAPI:", error)
        }
    }



    // save user news category preferences
    const saveCategories = async _ => {
        toastStore.trigger(toastData); // trigger toast noti

        // reset all categories to false
        for (const key in categories) {
            if (Object.hasOwnProperty.call(categories, key)) {
                categories[key] = false;
            }
        }
        // set selected category to true
        categories[selectedCategory] = true;

        // pass to auth handler to update user prefs
        await authHandlers.updatePrefs(categories);
    }


    onMount(async _ => {
        // subscribe to news category preferences auth store
        authStore.subscribe(curr => {
            categories = curr.newsPrefs;

            // loop through categories to find selected category
            for (const key in categories) {
                if (categories[key] === true) {
                    selectedCategory = key;
                    console.log(categories)
                }
            }
        });

        // fetching articles
        await fetchArticles();
        if (!articles) { // if no articles fetched (error)
            console.log("Error. no articles fetched.")
        }

        // loop through articles to get thumbnails for all null values
        for (const article of articles.articles) {
            if (!articles.articles.urlToImage) { // if null value
                await fetchArticleImg(article.url); // fetch thumbnail from backend
            }
        }
    });


    
    // format article title (removes trailing " - " and everything after it)
    const removeTrail = str => {
        const i = str.lastIndexOf(" - "); // find last index of " - "
        if (i !== -1) { // if trailing " - " exists
            return str.slice(0, i)
        }
        return str;
    }

    // calling facebook/bart-large-cnn from huggingface inference API
    const query = async data => {
        try {
            // fetch summarized article body
            const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: { Authorization: "Bearer " + "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" },
                    maxBodyLength: Infinity,
                    method: "POST",
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();
            return result; // return summarized article body
        }
        catch (error) { // if fails
            console.log(error);
        }
    }

    // summarize wrapper function
    const summarize = async body => {
        if (body) { // if body exists
            query({"inputs": body}).then((response) => {
                articleBody = response[0].summary_text; // set article body to summarized text

                return; // exit
            });
        }
    }

    // fetch article logo from backend
    const fetchArticleLogo = async img => {
        img = img.replace(" ", "%20"); // format image URL
        let imgPath = `http://localhost:3000/images/${img}.png`;

        try { // try fetching image
            const res = await fetch(imgPath);
            if (!res.ok) { // if fails
                throw new Error("Failed to fetch article logo.");
            }
            return imgPath; // Return the image URL if it exists
        } catch (error) { // If fetch fails, return the URL of the default image
            return "http://localhost:3000/images/src.png";
        }
    }



    initializeStores();
    let drawerStore = getDrawerStore(); // get drawer store (for opening article drawer)

    // open article function
    const openArticle = article => {
        // article drawer config
        const drawerSettings = {
            position: "bottom",
            height: "h-[90vh]", //90% of vh
            meta: {
                articleTitle: article.title, // store article header (for displaying on main page)
                articleURL: article.url // store article URL (for displaying link to original inside article slider)
            }
        };
        // open drawer
        drawerStore.open(drawerSettings);
    }
</script>

<div class="container">
    <!-- article drawer (singleton pattern) -->
    <Drawer>
        <div class="p-4">
            <!-- article header -->
            <h1 class="h1 p-10">{$drawerStore.meta.articleTitle}</h1>
            {#if !articleBody} <!-- if article body is not fetched -->
                <!-- preloader elements -->
                <section class="card w-full">
                    <div class="p-4 space-y-4">
                        {#each {length: 10} as _}
                            <div class="placeholder animate-pulse" />
                        {/each}
                    </div>
                </section>
            {:else} <!-- if article body is fetched -->
                <p>{articleBody}</p>
                <br>
                <a href="{$drawerStore.meta.articleURL}" class="variant-soft-secondary bg-transparent underline">Link to the original article -&gt;</a>
            {/if}
        </div>
    </Drawer>
    

    <!-- news category selectors -->
    {#if categories}
        <div class="flex justify-center flex-1">
            {#each Object.keys(categories) as c} <!-- loop through categories -->
                <!-- style each category chip button --> 
                <button
                    class="chip {selectedCategory === c ? 'variant-filled' : 'variant-soft'} m-2"
                    on:click={() => { selectedCategory = c; saveCategories()}}
                    on:keypress
                >
                    {#if selectedCategory === c}<span>✓</span>{/if} <!-- if selected, show checkmark -->
                    <span class="capitalize">{c}</span>
                </button>
            {/each}
        </div>
    {/if}



    <!-- article cards -->
    {#key API_URL} <!-- refresh block if changes to API_URL are detected -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 m-8 justify-items-center items-center">
        {#if articles.articles && articles.articles.length > 0} <!-- if articles have loaded -->
            {#each articles.articles as article}
            <button on:click={_ => {articleFetchButtonHandler(article.url); openArticle(article)}}> <!-- Pass article data to openArticle function -->
                <div class="card card-hover overflow-hidden max-w-2xl aspect-auto">
                    <header>
                        {#if !article.urlToImage} <!-- if no thumbnail URL from API, fetch myself from backend -->
                            <img src="{articleThumbnails[article.url]}" class="bg-black/50 w-full height-auto aspect-[16/9]" alt="article thumbnail" on:error={e => {e.target.src = "http://localhost:3000/images/placeholder.png"}} />
                        {:else} <!-- otherwise use API method to get thumbnail -->
                            <img src="{article.urlToImage}" class="bg-black/50 w-full height-auto aspect-[16/9]" alt="article thumbnail" />
                        {/if}
                    </header>
                    <div class="p-4 space-y-4">
                        {#if article.source.name} <!-- if article source name is NOT null (having better luck with article.source.name instead of article.source.id) -->
                            {#await fetchArticleLogo(article.source.name)}
                                <img src="http://localhost:3000/images/src.png" class="max-w-8 h-auto" alt="{article.source.name}"> <!-- placeholder source logo -->
                            {:then logoUrl}
                                <img src={logoUrl} class="max-w-8 h-auto" alt="{article.source.name}"> <!-- article source logo -->
                            {:catch}
                                <img src="http://localhost:3000/images/src.png" class="max-w-8 h-auto" alt="{article.source.name}"> <!-- placeholder source logo -->
                            {/await}
                        {/if}
                        <h3 class="h3 text-left" data-toc-ignore>{removeTrail(article.title)}</h3> <!-- article title (formatted) -->
                    </div>
                    <hr class="opacity-50" />
                    <footer class="p-4 flex justify-start items-center space-x-4">
                        <div class="flex-auto flex justify-between items-center">
                            <small data-toc-ignore>By: {article.source.name}</small> <!-- article source -->
                            <small>Published: {article.publishedAt.slice(0, 10)}</small> <!-- article publish date -->
                        </div>
                    </footer>
                </div>
            </button>
            {/each}
        {:else} <!-- if articles have NOT loaded -->
            <div />
            <ProgressRadial width="w-10" /> <!-- preloader -->
        {/if}
    </div>
    {/key}
</div>