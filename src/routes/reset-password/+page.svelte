<script>
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { authHandlers } from "../../store/store";

	let email;
	
	let authenticating = false;

	// invalid input error tracker
	let error = false;

	const btnResetPswd = async _ => {
		if(authenticating) { // prevent user from spam-clicking authenticate
			return;
		}

		error = false;

		if (!email) { // if email field is left blank
			invalidError = true;

			return;
		}

		authenticating = true;

		// attempting reset
		try {
			await authHandlers.resetPassword(email)
		} catch (error) {
			console.log("Failed to reset password: ", error);
			error = true;
			authenticating = false;
		}
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center flex-col w-3/5">

	<strong class="text-xl uppercase">RESET PASSWORD</strong>
	
	<label class="label w-full">
		<span>Email</span>
		<input bind:value={email} class="input w-full" title="Input (email)" type="email" placeholder="john@example.com" autocomplete="email" />
	</label>

	{#if error}
	<p class="variant-soft-primary">ERROR! Failed to reset password.</p>
	{/if}

	<button type="button" on:click={btnResetPswd} class="btn variant-filled-primary m-4">
		{#if authenticating && !error}
			<ProgressRadial width="w-5" />
		{:else}
			Submit
		{/if}
	</button>

	<a href="/login" class="button variant-soft-secondary bg-transparent underline">&lt;- Back to login page</a>
</div>

<style>
    label {
        padding: 8px;
    }
</style>