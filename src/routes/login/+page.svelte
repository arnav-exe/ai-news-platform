<script>
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { authHandlers } from "../../store/store";

	let email;
	let password;
	
	let authenticating = false;

	// invalid input error tracker
	let invalidError = false;
	let doesNotExistError = false;

	const authenticator = async _ => {
		if(authenticating) { // prevent user from spam-clicking authenticate
			return;
		}

		invalidError = false;
		doesNotExistError = false;

		if (!email || !password) { // if any field is left blank
			invalidError = true;

			return;
		}

		authenticating = true;

		// attempting login
		try {
			await authHandlers.login(email, password)
		} catch (error) {
			console.log("Auth error: ", error);
			doesNotExistError = true;
			authenticating = false;
		}
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center flex-col w-3/5">

	<strong class="text-xl uppercase">LOGIN</strong>
	
	<label class="label w-full">
		<span>Email</span>
		<input bind:value={email} class="input w-full" title="Input (email)" type="email" placeholder="john@example.com" autocomplete="email" />
	</label>

	<label class="label w-full">
		<span>Password</span>
		<input bind:value={password} class="input" title="Input (password)" type="password" placeholder="password" />
	</label>

	{#if invalidError}
	<p class="variant-soft-primary">ERROR! Invalid email or password. Please try again.</p>
	{:else if doesNotExistError}
	<p class="variant-soft-primary">ERROR! User does not exist. Please create an account first.</p>
	{/if}

	<button type="button" on:click={authenticator} class="btn variant-filled-primary m-4">
		{#if authenticating && !invalidError && !doesNotExistError}
			<ProgressRadial width="w-5" />
		{:else}
			Submit
		{/if}
	</button>

	<a href="/reset-password" class="variant-soft-secondary bg-transparent underline">Forgot Password?</a>

</div>

<style>
    label {
        padding: 8px;
    }
</style>