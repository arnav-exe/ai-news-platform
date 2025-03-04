<script>
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { authHandlers } from "../../store/store";

	// vars to bind input fields to
	let email;
	let password;
	
	// tracks if user is currently authenticating
	let authenticating = false;

	// invalid input error tracker
	let invalidError = false;
	let incorrectPswdError = false;

	// main auth function
	const authenticator = async _ => {
		if(authenticating) { // prevent user from spam-clicking authenticate
			return;
		}

		// reset error trackers
		invalidError = false;
		incorrectPswdError = false;

		if (!email || !password) { // if any field is left blank
			invalidError = true;

			return;
		}

		// user is currently authenticating
		authenticating = true;

		// attempting login
		try {
			await authHandlers.login(email, password)
		} catch (error) { // if login auth fails
			console.log("Auth error: ", error);
			incorrectPswdError = true;
			authenticating = false;
		}
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center flex-col w-3/5">

	<strong class="text-xl uppercase">LOGIN</strong>
	
	<!-- email input -->
	<label class="label w-full">
		<span>Email</span>
		<input bind:value={email} class="input w-full" title="Input (email)" type="email" placeholder="john@example.com" autocomplete="email" />
	</label>

	<!-- password input -->
	<label class="label w-full">
		<span>Password</span>
		<input bind:value={password} class="input" title="Input (password)" type="password" placeholder="password" />
	</label>

	<!-- error messages based on type of error -->
	{#if invalidError || incorrectPswdError}
	<p class="variant-soft-primary">ERROR! Invalid email or password. Please try again.</p>
	{/if}

	<!-- submit button -->
	<button type="button" on:click={authenticator} class="btn variant-filled-primary m-4">
		{#if authenticating && !invalidError && !incorrectPswdError}
			<ProgressRadial width="w-5" />
		{:else}
			Submit
		{/if}
	</button>

	<!-- forgot password link -->
	<a href="/reset-password" class="variant-soft-secondary bg-transparent underline">Forgot Password?</a>

</div>

<style>
    label {
        padding: 8px;
    }
</style>