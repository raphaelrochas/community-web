<script lang="ts">
import type {RoomDTOResp, CreateRoomDTO} from "../../api/type/chat"
import {createRoom}  from "../../api/http/chat"

let isLoading: boolean = $state(false)
let input: CreateRoomDTO = $state({name: "", password:""})
let error: string = $state("")
let succes: boolean = $state(false)

async function handleCreateRoom(e: Event) {
    e.preventDefault()
    isLoading = true

    if (input.name === "") {
        error = "The room must have a name"
        return
    }

    try {
        await createRoom(input)
        succes = true
        input.name = ""
        input.password = ""
    } catch {
        error = "failed to create the room"
        isLoading = false
    }
}
</script>


<section class="createroom">
    <h2>Create your room</h2>
    <form onsubmit={handleCreateRoom}>
        <input placeholder="name"  type="text" bind:value={input.name}>
        <input placeholder="room password" bind:value={input.password}>
        <button disabled={isLoading}>Create</button>
    </form>
    {#if succes === true}
        <p>Room created, you can search it</p>
    {:else}
        <p>{error}</p>
    {/if}
</section>


<style>
section form {
    display: flex;
    gap: 1rem; 
    
}

section button {
    border-radius: 10px;
}
</style>