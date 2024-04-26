<script>
    let firstName;
    let lastName;
    let email;
    let password;
    let confirmPassword;

    // invalid input error trackers
    let emptyError = false;
    let notMatchingError = false;


    const authenticator = _ => {
        emptyError = false;
        notMatchingError = false;
        
        if (!firstName || !lastName || !email || !password || !confirmPassword) { // if any field is left blank
            emptyError = true;
            
            return;
        }
        else if (password !== confirmPassword) {
            notMatchingError = true;
            
            return;
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
    {/if}

	<br>

	<button type="button" on:click={authenticator} class="btn variant-filled-primary">Submit</button>

</div>

<style>
    label {
        padding: 8px;
    }
</style>