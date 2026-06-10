<script lang="ts">
import type {MessageDTO, MessageDTOResp} from "../../api/type/chat"
import {getMessage} from "../../api/http/chat"
import {activeRoomStore} from "../../../store/activeRoom"
import {onDestroy, onMount} from "svelte"
import { websocket } from "../../api/ws/client";

let error: string = $state("")
let inputMessage: string = $state("")
let storageMessages: MessageDTOResp[] = $state([])
let messages = $derived([...storageMessages, ...$websocket.messages]);

$effect(() => {
    const room = $activeRoomStore
    if (!room) return

    error = ""
    storageMessages = []
    websocket.disconnect()
    websocket.clearMessages()

    getMessage(room.id, 0).then(data => storageMessages = data).catch(() => error = "failed to fetch messages")

    websocket.connect(room.id)
})

async function handleSend() {
    if (!inputMessage.trim()) return
    const message: MessageDTO = {content: inputMessage}

    websocket.send(message)
    inputMessage = ""
}

onMount(async () => {
    if($activeRoomStore === null) {
        error = "failed to join the room"
        return
    }

    try {
        storageMessages = await getMessage($activeRoomStore.id, 0)
    } catch (err) {
        error = "failed to fetch messages"
    }
})

onDestroy(() => {
    activeRoomStore.deleteRoom()
    websocket.disconnect()
    websocket.clearMessages()
})

</script>

<section>
    {#if $activeRoomStore}
        <h2>{$activeRoomStore.name}</h2>
        <span>{$activeRoomStore.id}</span>
        <div>
            {#each messages as message}
                <span>{message.sender_username}</span>
                <span>{message.content}</span>
                <span>{message.created_at}</span>
            {/each}
        </div>
        <div>
            <input bind:value={inputMessage}>
            <button onclick={handleSend}>Envoyer</button>
        </div>
        {#if error}
            <p>{error}</p>
        {/if}
    {/if}
</section>

