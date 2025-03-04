<script>
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { authHandlers } from "../../store/store";

    // vars to bind input fields to
    let firstName;
    let lastName;
    let email;
    let password;
    let confirmPassword;

    // tracks if user is currently authenticating
    let authenticating = false;

    // various error trackers
    let emptyError = false;
    let notMatchingError = false;
    let authError = false;

    
    // main auth function
    const authenticator = async _ => {
        if(authenticating) { // prevent user from spam-clicking authenticate
			return;
		}

        // reset error trackers
        emptyError = false;
        notMatchingError = false;
        authError = false;

        // if any field is left blank
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            emptyError = true;
            
            return;
        }

        // if passwords do not match
        if (password !== confirmPassword) {
            notMatchingError = true;
    
            return;
        }

        // user is currently authenticating
		authenticating = true;

        // attempting signup
        try {
            await authHandlers.signup(email, password, firstName, lastName) 
        } catch (error) { // if signup auth fails
            console.error("Auth Error: ", error);
            authError = true;
            authenticating = false;
        }
    }
</script>



<div class="container h-full mx-auto flex justify-center items-center flex-col w-3/5">

	<strong class="text-xl uppercase">SIGN-UP</strong>
	
    <!-- first name input -->
	<label class="label w-full">
        <span>First Name</span>
        <input bind:value={firstName} class="input" title="Input (text)" type="text" placeholder="first name" />
    </label>

    <!-- last name input -->
    <label class="label w-full">
        <span>Last Name</span>
        <input bind:value={lastName} class="input" title="Input (text)" type="text" placeholder="last name" />
    </label>

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

    <!-- confirm password input -->
    <label class="label w-full">
		<span>Confirm Password</span>
		<input bind:value={confirmPassword} class="input" title="Input (password)" type="password" placeholder="confirm password" />
	</label>

    <!-- error messages based on type of error -->
    {#if emptyError}
    <p class="variant-soft-primary">ERROR! One or more fields are empty.</p>
    {:else if notMatchingError}
    <p class="variant-soft-primary">ERROR! Passwords do not match.</p>
    {:else if authError}
    <p class="variant-soft-primary">ERROR! There was an error with authentication. Please try again.</p>
    {/if}

	<br>

    <!-- submit button -->
	<button type="button" on:click={authenticator} class="btn variant-filled-primary">
        {#if authenticating && !emptyError && !notMatchingError && !authError}
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