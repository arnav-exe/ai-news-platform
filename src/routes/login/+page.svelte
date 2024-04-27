<script>
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { authHandlers } from "../../store/store";

	let email;
	let password;
	
	let authenticating = false;

	// invalid input error tracker
	let emptyError = false;
	let doesNotExistError = false;

	const authenticator = async _ => {
		if(authenticating) { // prevent user from spam-clicking authenticate
			return;
		}

		emptyError = false;
		doesNotExistError = false;

		if (!email || !password) { // if any field is left blank
			emptyError = true;

			return;
		}

		authenticating = true;

		// attempting login
		try {
			await authHandlers.login(email, password)
		} catch (error) {
			console.log("Auth error: ", error);
			doesNotExistError = true;
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

	{#if emptyError}
	<p class="variant-soft-primary">ERROR! Invalid email or password. Please try again.</p>
	{:else if doesNotExistError}
	<p class="variant-soft-primary">ERROR! User does not exist. Please create an account first.</p>
	{/if}

	<br>

	<button type="button" on:click={authenticator} class="btn variant-filled-primary">
		{#if authenticating && !emptyError && !doesNotExistError}
			<ProgressRadial width="w-5" />
		{:else}
			Submit
		{/if}
	</button>

</div>

<style>
    label {
        padding: 8px;
    }
</style>