<script>

</script>

<div class="container h-full mx-auto flex justify-center items-center flex-col w-3/5">

	<strong class="text-xl uppercase">SIGN-UP</strong>
	
	<label class="label w-full">
        <span>First Name</span>
        <input class="input" title="Input (text)" type="text" placeholder="first name" />
    </label>

    <label class="label w-full">
        <span>Last Name</span>
        <input class="input" title="Input (text)" type="text" placeholder="last name" />
    </label>

    <label class="label w-full">
		<span>Email</span>
		<input class="input w-full" title="Input (email)" type="email" placeholder="john@example.com" autocomplete="email" />
	</label>

    <label class="label w-full">
		<span>Password</span>
		<input class="input" title="Input (password)" type="password" placeholder="password" />
	</label>

	<br>

	<button type="button" class="btn variant-filled-primary">Submit</button>

</div>

<style>
    label {
        padding: 8px;
    }
</style>