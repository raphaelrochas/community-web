<script lang="ts">
import {roomStore} from "../../../store/room"
import {websocket} from "../../api/ws/client"
import {activeRoomStore} from "../../../store/activeRoom"
import type {RoomDTOResp} from "../../api/type/chat"
import {joinRoom, searchRoom} from "../../api/http/chat"

let rooms: RoomDTOResp[] = $derived($roomStore.rooms)
let searchedRooms: RoomDTOResp[] = $state([])

let isLoading: boolean = $state(false)

let error: string = $state("")
let succes: boolean = $state(true)
let isUserSearch: boolean = $state(false)
let roomToGo: RoomDTOResp | null = $state(null)

let searchName: string = $state("")
let param: string = $state("")
let page: number = $state(0)


async function handleSearch(e: Event) {
    e.preventDefault()
    isLoading = true
    isUserSearch = true

    if (searchName === "") {
        error = "bad request"
        return
    }

    try {
        searchedRooms = await searchRoom(page, searchName)
        succes = true
        isLoading = false
    } catch (err){
        error = "search failed"
        isLoading = false
    }
}

async function handleGoRoom() {

    if (roomToGo === null) {
        error = "failed to join the room"
        return
    }
    
    activeRoomStore.setRoom(roomToGo)
    websocket.connect(roomToGo.id)
}

async function handleJoinRoom(roomID: string) {
    isLoading = true

    if (param === "") {
        error = "bad request"
        return
    }

    try {
        await joinRoom(roomID)
        succes = true 
    } catch {
        error = "failed to join the room"
        isLoading = false
    }
}

</script>

<section class="room">
    <h2>Popular Rooms</h2>
    <article>
        <form onsubmit={handleSearch}>
            <input type="text" placeholder="room name" bind:value={searchName}>
            <button disabled={isLoading}>Search</button>
            <h1>{error}</h1>
        </form>
    {#if (isUserSearch)}
        <h2>{searchName}</h2>
         {#each searchedRooms as searchedRoom }
            <article>
                <h3>{searchedRoom.name}</h3>
                <span>{searchedRoom.members}</span>
                {#if !searchedRoom.is_joined}
                    <button onclick={() => {handleJoinRoom(searchedRoom.id)}}>join</button>
                {:else}
                    <button onclick={() => {roomToGo = searchedRoom; handleGoRoom()}}>Go</button>
                {/if}
                </article>
         {/each}   
    {/if}    
    </article>
    {#each rooms as room }
        <article>
            <h3>{room.name}</h3>
            <span>{room.members}</span>
            {#if !room.is_joined}
                <button onclick={() => {handleJoinRoom(room.id)}}>join</button>
            {:else}
                <button onclick={() => {roomToGo = room; handleGoRoom()}}>Go</button>
            {/if}
        </article>
    {/each}
    {#if (succes === true)}
        <p>Room created, you can find it with the search engine</p>
    {:else}
        <p>{error}</p>
    {/if}
</section>
