<script>
	import '../app.postcss';
	import { onMount } from 'svelte';
	import { auth, db } from "../lib/firebase/firebase"
	import { AppShell, AppBar, Avatar, LightSwitch, storePopup, ListBox, ListBoxItem, popup } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	
    import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { authStore } from "../store/store"
	
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	let loggedIn = true;
	let displayButtons = true;

	const nonAuthRoutes = ["/", "/login", "/signup"];

	onMount(_ => {
		console.log("Mounting");
		const unsubscribe = auth.onAuthStateChanged(async user => {
			const currentPath = window.location.pathname;

			if (!user && !nonAuthRoutes.includes(currentPath)) { // if user is NOT logged in
				// this means user is tryng to access authorized route
				// deny access
				window.location.href = "/";
				loggedIn = false;
				return
			}

			if (!user) {
				loggedIn = false;
				return;
			}
			
			let dataToSetStore; // user data to save to context store

			// means user is authenticated
			const docReference = doc(db, "users", user.uid);
			const docSnapshot = await getDoc(docReference);

			loggedIn = true;

			if (!docSnapshot.exists()) { // if user document does NOT exist
				console.log("Creating user")
				const userReference = doc(db, "users", user.uid);
				
				dataToSetStore = {
					email: user.email,
					displayName: user.displayName,
					initials: user.initials
				};

				await setDoc(userReference, dataToSetStore, { merge: true });
			}
			else { // if user document DOES exist
				console.log("Fetching user");
				const userData = docSnapshot.data();
				dataToSetStore = userData;
			}

			authStore.update((curr) => {
				return {
					...curr, // spread current data incase there is anything extra
					user, // user in context
					loading: false, // loading is false since userdata has now been loaded
					data: dataToSetStore // user data
				};
			});
		});




		if (window.location.href.includes("login") || window.location.href.includes("signup")) {
			displayButtons = false;
		}
		else {
			displayButtons = true;
		}




		return unsubscribe;
	});

	// AVATAR COMBOBOX
	let comboboxValue;

	const popupCombobox = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">TL;DR NEWS</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />

				{#if displayButtons}
				{#if loggedIn}
					<div use:popup={popupCombobox}>
						<button><Avatar initials="AJ" background="bg-primary-500" border="border-4 border-surface-300-600-token hover:!border-primary-500" cursor="cursor-pointer" /></button>
					</div>
	
					<div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
						<ListBox rounded="rounded-none">
							<ListBoxItem bind:group={comboboxValue} name="medium" value="settings">Account Settings</ListBoxItem>
							<ListBoxItem bind:group={comboboxValue} name="medium" value="sign-out">Sign Out</ListBoxItem>
						</ListBox>
						<div class="arrow bg-surface-100-800-token" />
					</div>
				{:else if !loggedIn}
						<a href="/login" type="button" background="bg-primary-500" class="btn variant-filled-primary">Login</a>
						<a href="/signup" type="button" background="bg-primary-500" class="btn variant-filled-secondary">Signup</a>
				{/if}
				{/if}
				

			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>