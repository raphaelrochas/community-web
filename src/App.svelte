<script lang="ts">
import Header from "./lib/components/page/Header.svelte";
import Authenticate from "./lib/components/authenticate/Authenticate.svelte";
import RoomCreate from "./lib/components/room/RoomCreate.svelte";
import RoomFinder from "./lib/components/room/RoomFinder.svelte";
import RoomMessaging from "./lib/components/room/RoomMessaging.svelte";
import {userStore} from "./store/user"
import {roomStore} from "./store/room"
import {activeRoomStore} from "./store/activeRoom"
import {onMount} from "svelte"
    import Footer from "./lib/components/page/Footer.svelte";

let activeRoom = $derived($activeRoomStore)
let fetched: boolean =  false
console.log($userStore.isAuthenticated)

$effect(() => {
    if ($userStore.isAuthenticated && !fetched) {
        fetched = true
        roomStore.fetchRooms(0)
    }
})

onMount(async () => {
    await userStore.checkAuth()
})
</script>
<header>
    <Header />
</header>

{#if $userStore.isLoading || $roomStore.isLoading}
    <div class="overlay">
        <p>...</p>
        <h1>chargement</h1>
    </div>
{:else if !$userStore.isAuthenticated}
    <Authenticate />
{:else if activeRoom === null}
    <div class="room">
        <RoomCreate />
        <RoomFinder />
    </div>  
{:else}
    <RoomMessaging />
{/if}
<footer>
    <Footer />
</footer>

<style>
.room {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
</style>

