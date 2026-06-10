<script lang="ts">
import Authenticate from "./lib/components/authenticate/Authenticate.svelte";
import RoomCreate from "./lib/components/room/RoomCreate.svelte";
import RoomFinder from "./lib/components/room/RoomFinder.svelte";
import RoomMessaging from "./lib/components/room/RoomMessaging.svelte";
import {userStore} from "./store/user"
import {roomStore} from "./store/room"
import {activeRoomStore} from "./store/activeRoom"
import {onMount} from "svelte"

let activeRoom = $derived($activeRoomStore)

onMount(async () => {
    await userStore.checkAuth()
    if ($userStore.isAuthenticated) {
        await roomStore.fetchRooms(0)

    }
})
</script>
{#if $userStore.isLoading || $roomStore.isLoading}
    <div class="overlay">
        <p>...</p>
    </div>
{/if}

{#if !$userStore.isAuthenticated}
    <Authenticate />
{:else}
    <RoomCreate />
    <RoomFinder />
    {#if activeRoom !== null}
        <RoomMessaging />
    {/if}
{/if}






