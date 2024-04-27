<script>
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { authHandlers } from "../../store/store";

    let firstName;
    let lastName;
    let email;
    let password;
    let confirmPassword;

    let authenticating = false;

    // invalid input error trackers
    let emptyError = false;
    let notMatchingError = false;
    let authError = false;

    setTimeout(_ => {

    }, 1000);


    const authenticator = async _ => {
        if(authenticating) { // prevent user from spam-clicking authenticate
			return;
		}

        emptyError = false;
        notMatchingError = false;
        authError = false;

        if (!firstName || !lastName || !email || !password || !confirmPassword) { // if any field is left blank
            emptyError = true;
            
            return;
        }
        else if (password !== confirmPassword) {
            notMatchingError = true;
            
            return;
        }

		authenticating = true;

        // attempting signup
        try {
            await authHandlers.signup(email, password) 
        } catch (error) {
            console.log("Auth Error: ", error);
            authError = true;
        }
    }
</script>



<div class="container h-full mx-auto flex justify-center items-center flex-col w-3/5">

	<strong class="text-xl uppercase">SIGN-UP</strong>
	
	<label class="label w-full">
        <span>First Name</span>
        <input bind:value={firstName} class="input" title="Input (text)" type="text" placeholder="first name" />
    </label>

    <label class="label w-full">
        <span>Last Name</span>
        <input bind:value={lastName} class="input" title="Input (text)" type="text" placeholder="last name" />
    </label>

    <label class="label w-full">
		<span>Email</span>
		<input bind:value={email} class="input w-full" title="Input (email)" type="email" placeholder="john@example.com" autocomplete="email" />
	</label>

    <label class="label w-full">
		<span>Password</span>
		<input bind:value={password} class="input" title="Input (password)" type="password" placeholder="password" />
	</label>

    <label class="label w-full">
		<span>Confirm Password</span>
		<input bind:value={confirmPassword} class="input" title="Input (password)" type="password" placeholder="confirm password" />
	</label>

    {#if emptyError}
    <p class="variant-soft-primary">ERROR! One or more fields are empty.</p>
    {:else if notMatchingError}
    <p class="variant-soft-primary">ERROR! Passwords do not match.</p>
    {:else if authError}
    <p class="variant-soft-primary">ERROR! There was an error with authentication. Please try again.</p>
    {/if}

	<br>

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