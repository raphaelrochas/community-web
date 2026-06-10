<script lang="ts">
import type {RoomDTOResp, CreateRoomDTO} from "../../api/type/chat"
import {createRoom}  from "../../api/http/chat"

let isLoading: boolean = $state(true)
let input: CreateRoomDTO = $state({name: ""})
let error: string = ""
let succes: boolean 

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
    } catch {
        error = "failed to create the room"
        isLoading = false
        
    }
}
</script>

<section class="createroom">
    <h2>Create your room</h2>
    <form onsubmit={handleCreateRoom}>
        <input type="text" bind:value={input.name}>
        <button>Create</button>
    </form>
</section>