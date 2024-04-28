<script>
    import { authStore } from "../../store/store";
    import { getToastStore } from "@skeletonlabs/skeleton";

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
        authHandlers.updateEmail(newEmail);
        toastStore.trigger(toastData);
    }

    const btnUpdatePswd = _ => {
        authHandlers.updatePassword(newPswd);
        toastStore.trigger(toastData);
    }

</script>

{#if !$authStore.loading}
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

        <a class="variant-soft-secondary bg-transparent underline m-8" href="/">&lt;- Back to home</a>
    </div>
{/if}



<style>
    label {
        padding: 8px;
    }
</style>