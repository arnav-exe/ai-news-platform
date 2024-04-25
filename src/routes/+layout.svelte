<script>
	import '../app.postcss';
	import { onMount } from 'svelte';
	import { auth, db } from "../lib/firebase/firebase"
	import { AppShell, AppBar, Avatar, LightSwitch } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	
    import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { authStore } from "../store/store"
	
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });


	const btnHandler = _ => {
		console.log("clicked")
	};

	const nonAuthRoutes = ["/"];

	onMount(_ => {
		console.log("Mounting");
		const unsubscribe = auth.onAuthStateChanged(async user => {
			const currentPath = window.location.pathname;

			if (!user && !nonAuthRoutes.includes(currentPath)) { // if user is NOT logged in
				// this means user is tryng to access authorized route
				// deny access
				window.location.href = "/";
				return
			}

			if (!user) {
				return;
			}
			
			let dataToSetStore; // user data to save to context store

			// means user is authenticated
			const docReference = doc(db, "users", user.uid);
			const docSnapshot = await getDoc(docReference);

			if (!docSnapshot.exists()) { // if user document does NOT exist
				console.log("Creating user")
				const userReference = doc(db, "user", user.uid);
				
				dataToSetStore = {
					email: user.email
					// displayName: user.displayName,
					// initials: user.initials
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
		return unsubscribe;
	});
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
				<button on:click={btnHandler}><Avatar initials="AJ" background="bg-primary-500" /></button>							
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
