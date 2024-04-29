<script>
    import { authStore } from "../../store/store";
    import { getToastStore, initializeStores } from "@skeletonlabs/skeleton";

	// init toast noti stores
    initializeStores();
    const toastStore = getToastStore();		

    // vars to bind input fields to
    let newEmail;
    let newPswd;

    // toast noti config
    const toastData = {
        message: 'Updated successfully!',
        timeout: 5000,
        background: 'variant-filled-success'
    };

    // update email auth handler
    const btnUpdateEmail = _ => {
        authHandlers.updateEmail(newEmail);
        toastStore.trigger(toastData);
    }

    // update password auth handler
    const btnUpdatePswd = _ => {
        authHandlers.updatePassword(newPswd);
        toastStore.trigger(toastData);
    }

</script>

<!-- if auth store has finished loading user data -->
{#if !$authStore.loading}
    <div class="container h-full mx-auto flex items-center flex-col p-8 w-3/5">
        <strong class="text-xl uppercase">ACCOUNT SETTINGS</strong>
        
        <!-- enter new email -->
        <label class="label w-full">
            <span>Update Email</span>
            <div class="input-group input-group-divider grid-cols-[10fr_1fr]">
                <input bind:value={newEmail} type="email" placeholder="update email" />
                <button on:click={btnUpdateEmail} class="variant-filled-primary">Submit</button>
            </div>
        </label>

        <!-- enter new password -->
        <label class="label w-full">
            <span>Update Password</span>
            <div class="input-group input-group-divider grid-cols-[10fr_1fr]">
                <input bind:value={newPswd} type="password" placeholder="update password" />
                <button on:click={btnUpdatePswd} class="variant-filled-primary">Submit</button>
            </div>
        </label>

        <!-- back to home page -->
        <a class="variant-soft-secondary bg-transparent underline m-8" href="/">&lt;- Back to home</a>
    </div>
{/if}



<style>
    label {
        padding: 8px;
    }
</style>