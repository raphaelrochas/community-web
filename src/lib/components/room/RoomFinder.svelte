<script lang="ts">
import {roomStore} from "../../../store/room"
import {websocket} from "../../api/ws/client"
import {activeRoomStore} from "../../../store/activeRoom"
import type {RoomDTOResp, JoinRoomDTO} from "../../api/type/chat"
import {joinRoom, searchRoom} from "../../api/http/chat"

let rooms: RoomDTOResp[] = $derived($roomStore.rooms)
let searchedRooms: RoomDTOResp[] = $state([])

let isLoading: boolean = $state(false)
let isUserSearch: boolean = $state(false)

let error: string = $state("")
let succes: boolean = $state(true)

let roomToGo: RoomDTOResp | null = $state(null)

let searchName: string = $state("")
let page: number = $state(0)
let passwords: Record<string, string> = $state({})


async function handleSearch(e: Event) {
    e.preventDefault()
    isLoading = true
    isUserSearch = true
    error = ""

    if (searchName.trim() === "") {
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

async function handleJoinRoom(roomID: string, password: string) {
    isLoading = true
    error = ""
    let input: JoinRoomDTO = {password: password, room_id: roomID}

    try {
        await joinRoom(input)
        const searchedIndex = searchedRooms.findIndex(r => r.id === input.room_id)
        if (searchedIndex !== -1){
            searchedRooms[searchedIndex] = {
                ...searchedRooms[searchedIndex], is_joined: true
            }
        } else {
            roomStore.joinedRooms(input)
        }

        succes = true 
    } catch {
        error = "failed to join the room"
        isLoading = false
    }
}
</script>


<section>
    <h2>Search Room</h2>
    <article class="finder-wrapper">
        <form onsubmit={handleSearch}>
            <input type="text" placeholder="room name" bind:value={searchName}>
            <button disabled={isLoading}>Search</button>
            <p>{error}</p>
        </form>
    </article>
</section>
<section class="result-wrapper">
    {#if isUserSearch}
        <h2>{searchName}</h2>
        {#each searchedRooms as searchedRoom }
            <article class="room-result">
                <h3>{searchedRoom.name}</h3>
                <span>{searchedRoom.members}</span>
                {#if !searchedRoom.is_joined}
                    {#if !searchedRoom.is_public}
                        <input type="text" placeholder="tes" bind:value={passwords[searchedRoom.id]}>
                    {/if}
                    <button onclick={() => {handleJoinRoom(searchedRoom.id, passwords[searchedRoom.id])}}>Join</button>        
                {:else}
                    <button onclick={() => {roomToGo = searchedRoom; handleGoRoom()}}>Go</button>
                {/if}
            </article>  
        {/each}
    {/if}
    <article>
        <h2>Popular Rooms</h2>
        {#each rooms as room}
            <article class="rooms-result">
                <h3>{room.name}</h3>
                <span>{room.members}</span>
                {#if !room.is_joined}
                    {#if !room.is_public}
                        <input type="text" bind:value={passwords[room.id]}>
                    {/if}
                    <button onclick={() => {handleJoinRoom(room.id, passwords[room.id])}}>join</button>
                {:else}
                    <button onclick={() => {roomToGo = room; handleGoRoom()}}>Go</button>
                {/if}
            </article>
        {/each}
    </article>
</section>


<style>
section {
    max-height: 50vh;
}

article {
    padding-bottom: 1rem;
    
}

.result-wrapper {
    overflow-y: auto;
}

.result-wrapper article {
    border-bottom: 1px white solid;
    padding: 1rem;
    
}

.rooms-result {
    display: flex;
    justify-content: space-between;
    align-items: center;
}


</style>
