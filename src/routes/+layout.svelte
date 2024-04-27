<script>
	import '../app.postcss';
	import { onMount } from 'svelte';
	import { auth, db } from "../lib/firebase/firebase"
	import { AppShell, AppBar, Avatar, LightSwitch, storePopup, popup } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	
    import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { authStore } from "../store/store"
	
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	let loggedIn = false; // user logged in tracker (for dynamic content updation)

	const nonAuthRoutes = ["/", "/login", "/signup"]; // routes that ARE allowed to be visited by unauthenticated users

	onMount(_ => {
		console.log("Mounting");
		const unsubscribe = auth.onAuthStateChanged(async user => { // listens to state changes (login, logout, register. etc.)
			console.log("user:")
			console.log(user)
			authStore.update(curr => {
				return {
					...curr,
					isLoading: false,
					currentUser: user
				};
			});
			const currentPath = window.location.pathname;

			if (!user && !nonAuthRoutes.includes(currentPath)) { // if user is NOT logged in
				// this means user is tryng to access authorized route
				// deny access
				window.location.href = "/";
				loggedIn = false;

				return;
			}

			if (!user) {
				loggedIn = false;

				return;
			}
			
			let dataToSetStore; // user data to save to context store

			// if code has passed above 2 if statements, means user is authenticated
			const docReference = doc(db, "users", user.uid);
			const docSnapshot = await getDoc(docReference);

			loggedIn = true;

			if (!docSnapshot.exists()) { // if users document does NOT exist
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

			console.log("curr object inside authStore.update():")
			console.log(user)
			authStore.update(curr => {
				
				return {
					...curr, // spread current data incase there is anything extra
					user: user, // user in context
					loading: false // userdata has now been loaded
					// data: dataToSetStore // user data
				};
			});
		});
		return unsubscribe;
	});



	

	const popupClick = {
		event: "click",
		target: "popupClick",
		placement: "bottom"
	};
					

	const testFunc1 = _ => {
		console.log("ACCESSING ACCOUNT SETTINGS");
	}

	const testFunc2 = _ => {
		console.log("LOGGING OUT");
	}
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

				{#if loggedIn}
					<button use:popup={popupClick}>
						<Avatar initials="AJ" background="bg-primary-500" border="border-4 border-surface-300-600-token hover:!border-primary-500" cursor="cursor-pointer" />
					</button>
					<div class="card p-4" data-popup="popupClick">
						<nav class="list-nav">
							<ul>
								<li><a on:click={testFunc1} href="/"><span class="flex-auto">Account Settings</span></a></li>
								<li><a on:click={testFunc2} href="/"><span class="flex-auto">Logout</span></a></li>
							</ul>
						</nav>
					</div>
				{:else if !loggedIn}
					<a href="/login" type="button" background="bg-primary-500" class="btn variant-filled-primary">Login</a>
					<a href="/signup" type="button" background="bg-primary-500" class="btn variant-filled-secondary">Signup</a>
				{/if}

			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>