<script>
	import '../app.postcss';
	import { onMount } from 'svelte';
	import { auth, db } from "../lib/firebase/firebase"
	import { AppShell, AppBar, Avatar, LightSwitch, storePopup, popup, initializeStores, Toast, getToastStore } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	
    import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { authHandlers, authStore } from "../store/store"
	
	// popup config
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// init toast noti stores
    initializeStores();
	const toastStore = getToastStore();

	let loggedIn = false; // user logged in tracker (for dynamic content updation)
	let initials = ""; // initials for profile avatar

	// routes that CAN be accessed unauthenticated users
	const nonAuthRoutes = ["/", "/login", "/signup", "/reset-password"];

	// on mount (check if user is logged in)
	onMount(_ => {
		const unsubscribe = auth.onAuthStateChanged(async user => { // listens to state changes (login, logout, register. etc.)

			const currentPath = window.location.pathname;

			// if user is NOT logged in
			if (!user && !nonAuthRoutes.includes(currentPath)) {
				// this means user is tryng to access authorized route
				// deny access
				window.location.href = "/";
				loggedIn = false;

				return;
			}

			// if user is NOT logged in
			if (!user) {
				loggedIn = false;

				return;
			}

			// if user is logged in, redirect to main
			if (user && (currentPath === "/login" || currentPath === "/signup")) {
				window.location.href = "/";
			}
			
			let dataToSetStore; // user data to save to context store

			// if code has passed above 2 if statements, means user is authenticated
			const docReference = doc(db, "users", user.uid);
			const docSnapshot = await getDoc(docReference);

			loggedIn = true;

			// if users document does NOT exist
			if (!docSnapshot.exists()) {
				console.log("Creating users collection")
				const userReference = doc(db, "users", user.uid);

				// data to set in user document
				dataToSetStore = {
					email: user.email, // user email
					firstName: "Guest",
					lastName: "User",
					newsPrefs: {
						general: true,
						business: false,
						entertainment: false,
						health: false,
						science: false,
						sports: false,
						technology: false
					}
				};

				// set user document
				await setDoc(userReference, dataToSetStore, { merge: true });
			}
			else { // if user document DOES exist
				const userData = docSnapshot.data();
				dataToSetStore = userData;
			}
		
			// calcing initials for profile avatar
			initials = docSnapshot.data().firstName[0] + docSnapshot.data().lastName[0];

			// update context store
			authStore.update((curr) => {
				return {
					...curr, // spread current data incase theres anything extra
					user: user, // user in context
					loading: false, // userdata has now been loaded
					newsPrefs: docSnapshot.data().newsPrefs // user news preferences
				};
			});
		});
		return unsubscribe;
	});


	// popup config
	const popupClick = {
		event: "click",
		target: "popupClick",
		placement: "bottom"
	};
					
	// direct to account settings page
	const btnAccountSettings = _ => {
		window.location.href = "/account-settings";
	}

	// toast noti config
	const toastData = {
        message: 'Logged out successfully!',
        timeout: 5000, // ms
        background: 'variant-filled-primary'
    };

	// log user out
	const btnLogout = _ => {
		authHandlers.logout();
		loggedIn = false;

		// toast noti confirming logout
		toastStore.trigger(toastData);
	}
</script>

<!-- toast noti instance (singleton pattern) -->
<Toast />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/"><strong class="text-xl uppercase p-1">TL;DR NEWS</strong></a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />

				<!-- dynamic content based on user login status -->
				{#if loggedIn}
					<button use:popup={popupClick}>
						<Avatar initials="{initials}" background="bg-primary-500" border="border-4 border-surface-300-600-token hover:!border-primary-500" cursor="cursor-pointer" />
					</button>

					<!-- popup menu of account options-->
					<div class="card p-4" data-popup="popupClick">
						<nav class="list-nav">
							<ul>
								<li><a on:click={btnAccountSettings} href="/"><span class="flex-auto">Account Settings</span></a></li>
								<li><a on:click={btnLogout} href="/"><span class="flex-auto">Logout</span></a></li>
							</ul>
						</nav>
					</div>

				<!-- if user is NOT logged in -->
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