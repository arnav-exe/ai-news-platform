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

    $: userLoggedIn = $authStore.user !== null; // flag to keep track of user login status

    // page state vars
    let categories = {};
    let selectedCategory = "general";
    let searchBarValue = ""; // bind to search bar
    let searchQuery = ""; // update API URL only when search btn is pressed
    let pageSize = 20;
    let page = 1;
    let language = "en";

    $: API_URL = buildAPIURL(selectedCategory, searchQuery, pageSize, page);

    const buildAPIURL = (selectedCategory, searchQuery, pageSize, page) => {
        let url = "https://newsapi.org/v2/top-headlines?";
        // let url = "https://api.com/top-headlines?"; // FOR TESTING
        
        url += `language=${language}&`;

        if (selectedCategory) {
            url += `category=${selectedCategory}&`;
        }

        if (searchQuery) {
            url += `q=${encodeURIComponent(searchQuery)}&`;
        }
        
        url += `pageSize=${pageSize}&`;
        url += `page=${page}&`;

        url += `apiKey=${import.meta.env.VITE_NEWSAPI_KEY}`

        return url;
    }

    // pagination functions
    const nextPage = _ => {
        if (articles.totalResults > page * pageSize) {
            page++;
            fetchArticles(); // force refetch on page change
        }
    }

    const prevPage = _ => {
        if (page > 1) {
            page--;
            fetchArticles(); // force refetch on page change
        }
    }

    const resetFilters = _ => {
        searchQuery = "";
        searchBarValue = "";
        pageSize = 20;
        page = 1;
    }

    // re-fetch articles on API_URL change
    $: {
        if (API_URL) {
            (async () => {
                await fetchArticles();
            })();
        }
    }

    let articles = []; // store API response

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
            const data = await articleRes.json();
            console.log("NEWSAPI Response", data); // log newsapi response
            articles = data;
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
        // get user news preferences
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
            // set totalResults to 0
            articles = {
                totalResults: 0
            }
        }

        // loop through articles to get thumbnails for all null values
        for (const article of articles.articles) {
            if (!article.urlToImage) { // if null value
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
            const payload = {
                inputs: data.inputs,
                // model hyperparams
                parameters: {
                    min_length: 50, // min summary length
                    max_length: 300, // max summary length
                    temperature: 0.7, // discourage diverse and 'creative' outputs
                    repetition_penalty: 1.2, // > 1 penalizes repetition
                    length_penalty: 1.0, // discourage longer summaries
                    no_repeat_ngram_size: 3, // avoid repeating trigrams
                }
            };
            // fetch summarized article body
            const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_HF_KEY}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify(payload)
                }
            );
            const result = await response.json();
            return result; // return summarized article body
        }
        catch (error) { // if fails
            console.log(error);
            return [{summary_text: data.inputs.substring(0, 300) + "..."}]; 
        }
    }

    // summarize wrapper function
    // const summarize = async body => {
    //     if (body) { // if body exists
    //         query({"inputs": body}).then((response) => {
    //             articleBody = response[0].summary_text; // set article body to summarized text

    //             return; // exit
    //         });
    //     }
    // }
    const summarize = async body => {
        if (!body) {
            return null
        };

        // fetch summarized text since body exists
        try {
            const response = await query({"inputs": body});
            articleBody = response[0].summary_text;
            return response[0].summary_text; // exit
        }
        catch (error) {
            console.error("Summarization error:", error);
            return "<i>(Failed to fetch summary. Displaying truncated article body)</i><br>" + body.substring(0, 300) + "...";
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
            <h1 class="h1 p-10 leading-tight">{$drawerStore.meta.articleTitle}</h1>
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
                <p>{@html articleBody}</p>
                <br>
                <a href="{$drawerStore.meta.articleURL}" class="variant-soft-secondary bg-transparent underline">Link to the original article -&gt;</a>
            {/if}
        </div>
    </Drawer>
    

    <!-- news article filter controls -->
    {#if userLoggedIn}
    <div class="flex flex-col xl:mx-52 lg:mx-32 md:mx-16 sm:mx-8 mx-4">
        <div>
            <!-- search query bar -->
            <label class="label">
                <span>Search Term</span>
                <div class="input-group input-group-divider grid-cols-[10fr_1fr]">
                    <input class="input" type="text" bind:value={searchBarValue} placeholder="Enter Search Term..." />
                    <button class="variant-filled-primary" on:click={() => {searchQuery = searchBarValue}}>Search</button>
                </div>
            </label>
        </div>
        <div class="flex justify-between flex-wrap items-center">
            <!-- news category selectors -->
            <div class="flex justify-center flex-wrap m-4">
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

            <div class="flex justify-center">
                <!-- results per page dropdown -->
                <label class="label mr-4">
                    <select bind:value={pageSize} class="select">
                        <option value={10}>10 results per page</option>
                        <option value={20}>20 results per page</option>
                        <option value={30}>30 results per page</option>
                        <option value={40}>40 results per page</option>
                        <option value={50}>50 results per page</option>
                    </select>
                </label>
            
                <!-- reset filters btn -->
                <div class="flex items-end">
                    <button class="btn variant-filled-primary" on:click={resetFilters}>
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    </div>
    {/if}

    <!-- display article cards (only if API returns results) -->
    {#if articles.totalResults > 0}
    {#key API_URL + page} <!-- refresh block if changes to API_URL are detected -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 m-8 justify-items-center items-center">
        {#if articles.articles && articles.articles.length > 0} <!-- if articles have loaded -->
            {#each articles.articles as article}
            <button on:click={_ => {articleFetchButtonHandler(article.url); openArticle(article)}}> <!-- Pass article data to openArticle function -->
                <div class="card card-hover overflow-hidden max-w-2xl aspect-auto">
                    <header>
                        {#if !article.urlToImage} <!-- if no thumbnail URL from API, fetch myself from backend -->
                            <img src="{articleThumbnails[article.url]}" class="bg-black/50 w-full height-auto aspect-[16/9]" alt="article thumbnail" on:error={e => {e.target.src = "http://localhost:3000/images/card-placeholder.png"}} />
                        {:else} <!-- otherwise use API method to get thumbnail -->
                            <img src="{article.urlToImage}" class="bg-black/50 w-full height-auto aspect-[16/9]" alt="article thumbnail" on:error={e => {e.target.src = "http://localhost:3000/images/card-placeholder.png"}} />
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

    <!-- pagination controls -->
    {#if articles.totalResults && articles.totalResults > pageSize}
    <div class="flex justify-center my-4 gap-4">
        <button class="btn variant-filled-primary" on:click={prevPage} disabled={page === 1}>Previous</button>
        
        <span class="flex items-center">Page {page} of {Math.ceil(articles.totalResults / pageSize)}</span>
        
        <button class="btn variant-filled-primary" on:click={nextPage} disabled={page >= Math.ceil(articles.totalResults / pageSize)}>Next</button>
    </div>
    {/if}
    <!-- display no articles found text -->
    {:else if articles.totalResults === 0}
        <div class="container h-full mx-auto flex items-center flex-col p-8 w-3/5">
            <p class="text-xl uppercase">NO ARTICLES FOUND</p>
        </div>
    {/if}
</div>
