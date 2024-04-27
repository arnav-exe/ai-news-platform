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
	let initials = "";

	const nonAuthRoutes = ["/", "/login", "/signup"]; // routes that CAN be accessed unauthenticated users

	onMount(_ => {
		const unsubscribe = auth.onAuthStateChanged(async user => { // listens to state changes (login, logout, register. etc.)

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

			if (user && (currentPath === "/login" || currentPath === "/signup")) { // if user is logged in, redirect to main
				window.location.href = "/";
			}
			
			let dataToSetStore; // user data to save to context store

			// if code has passed above 2 if statements, means user is authenticated
			const docReference = doc(db, "users", user.uid);
			const docSnapshot = await getDoc(docReference);

			loggedIn = true;

			if (!docSnapshot.exists()) { // if users document does NOT exist
				console.log("Creating users collection")
				const userReference = doc(db, "users", user.uid);

				dataToSetStore = {
					email: user.email, // user email
					newsPrefs: [] // preferred news categories
				};

				await setDoc(userReference, dataToSetStore, { merge: true });
			}
			else { // if user document DOES exist
				const userData = docSnapshot.data();
				dataToSetStore = userData;
			}
		
			// setting initials for profile avatar
			initials = docSnapshot.data().firstName[0] + docSnapshot.data().lastName[0];

			authStore.update((curr) => {
				return {
					...curr, // spread current data incase there is anything extra
					user: user, // user in context
					loading: false, // userdata has now been loaded
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
					
	// direct to account settings page
	const btnAccountSettings = _ => {
		window.location.href = "/account-settings";
	}

	// toast noti metadata
	const toastData = {
        message: 'Logged out successfully!',
        timeout: 5000,
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
				<strong class="text-xl uppercase">TL;DR NEWS</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />

				{#if loggedIn}
					<button use:popup={popupClick}>
						<Avatar initials="{initials}" background="bg-primary-500" border="border-4 border-surface-300-600-token hover:!border-primary-500" cursor="cursor-pointer" />
					</button>
					<div class="card p-4" data-popup="popupClick">
						<nav class="list-nav">
							<ul>
								<li><a on:click={btnAccountSettings} href="/"><span class="flex-auto">Account Settings</span></a></li>
								<li><a on:click={btnLogout} href="/"><span class="flex-auto">Logout</span></a></li>
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