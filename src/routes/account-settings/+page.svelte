<script>
    import { authHandlers } from "../../store/store";
    import { getToastStore } from '@skeletonlabs/skeleton';

	// init toast noti stores
    const toastStore = getToastStore();		

    let newEmail;
    let newPswd;



    const toastData = {
        message: 'Updated successfully!',
        timeout: 5000,
        background: 'variant-filled-success'
    };

    const btnUpdateEmail = _ => {
        // PERFORM REGEX VERIFICATION ON EMAIL FIRST
        // authHandlers.updateEmail(newEmail);
        toastStore.trigger(toastData);
    }

    const btnUpdatePswd = _ => {
        // authHandlers.updatePassword(newPswd);
        toastStore.trigger(toastData);
    }

    let categories = {
        general: true,
        business: false,
        entertainment: false,
        health: false,
        science: false,
        sports: false,
        technology: false
    };

    const toggle = category => {
        categories[category] = ! categories[category];
    }

</script>

<!-- <div class="container h-full mx-auto flex items-center p-8 flex-col w-3/5"> -->
<div class="container h-full mx-auto flex items-center flex-col p-8 w-3/5">
	<strong class="text-xl uppercase">ACCOUNT SETTINGS</strong>
    
    <label class="label w-full">
        <span>Update Email</span>
        <div class="input-group input-group-divider grid-cols-[10fr_1fr]">
            <input bind:value={newEmail} type="email" placeholder="update email" />
            <button on:click={btnUpdateEmail} class="variant-filled-primary">Submit</button>
        </div>
    </label>

    <label class="label w-full">
        <span>Update Password</span>
        <div class="input-group input-group-divider grid-cols-[10fr_1fr]">
            <input bind:value={newPswd} type="password" placeholder="update password" />
            <button on:click={btnUpdatePswd} class="variant-filled-primary">Submit</button>
        </div>
    </label>

    <span class="w-full my-4">
    <p class="mt-4">Preferred news categories</p>
    {#each Object.keys(categories) as c}
        <button
            class="chip {categories[c] ? 'variant-filled' : 'variant-soft'} m-2"
            on:click={() => { toggle(c); }}
            on:keypress
        >
            {#if categories[c]}<span>✓</span>{/if}
            <span class="capitalize">{c}</span>
        </button>
    {/each}
    </span>

    <a class="variant-soft-secondary bg-transparent underline" href="/">&lt;- Back to home</a>


</div>

<style>
    label {
        padding: 8px;
    }
</style>