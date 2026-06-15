<script lang="ts">
import type {MessageDTO, MessageDTOResp} from "../../api/type/chat"
import {getMessage} from "../../api/http/chat"
import {activeRoomStore} from "../../../store/activeRoom"
import {onDestroy, onMount, tick} from "svelte"
import { websocket } from "../../api/ws/client";
import {scrollBot} from "../../utils/ui"

let error = $state("")
let inputMessage = $state("")
let storageMessages: MessageDTOResp[] = $state([])
let messages = $derived([...storageMessages, ...$websocket.messages]);

let container: HTMLElement | null = $state(null)
let currentScrollPosition = $state(0)
let currentPage = $state(1)
let isLoading = $state(false)
let hasMoreMessages = $state(true)

$effect(() => {
    const room = $activeRoomStore
    if (!room) return

    error = ""
    storageMessages = []
    websocket.disconnect()
    websocket.clearMessages()
    websocket.connect(room.id)
}) 

async function handleScroll() {
    if (!container || !$activeRoomStore) return

    currentScrollPosition = container.scrollTop
    isLoading = true

    if (currentScrollPosition === 0 && storageMessages.length >= 99 && isLoading && hasMoreMessages) {
        try {
            const olderMessages = await getMessage($activeRoomStore.id, currentPage)
            if (olderMessages.length < 99) {
                hasMoreMessages = false
            }
            currentPage +=1

            storageMessages = [...olderMessages, ...storageMessages]
        } catch {
            error = "failed to load old message"
        } finally {
            isLoading = false
        }
    }
}

async function handleSend() {
    if (!inputMessage.trim()) return
    const message: MessageDTO = {content: inputMessage}

    websocket.send(message)
    inputMessage = ""
    
    setTimeout(() => {scrollBot(container)}, 10)
}

function handleKeyBoardInput(e: KeyboardEvent) {
    switch(e.key) {
        case 'Escape':
            activeRoomStore.deleteRoom()
            break
        case 'Enter':
            if (e.shiftKey) break
            e.preventDefault()
            handleSend()
            break
    }
}

onMount(async () => {
    if($activeRoomStore === null) {
        error = "failed to join the room"
        return
    }

    try {
        storageMessages = await getMessage($activeRoomStore.id, 0)
        setTimeout(() => {scrollBot(container)}, 5)
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

<svelte:window on:keydown={handleKeyBoardInput} />

<section>
    {#if $activeRoomStore}
        <h2>{$activeRoomStore.name}</h2>
        <div class="message-article" bind:this={container} onscroll={handleScroll}>
            {#each messages as message}
                <div class="message">
                    <span class="username">{message.sender_username}:</span>
                    <span>{message.content}</span>
                </div>
            {/each}
        </div>
        <div class="message-input">
            <textarea bind:value={inputMessage}></textarea>
            <button onclick={handleSend}>Envoyer</button>
        </div>
        {#if error}
            <p>{error}</p>
        {/if}
    {/if}
</section>


<style>
section {
    margin: 0 auto;
    height: 80vh;
}

button {
    max-height: 3rem;
}

textarea {
    flex: 1;
}

.message-article {
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.message {
    max-width: 90%;
    word-break: break-all;
}

.message-input {
    display: flex;
    gap: 0.5rem;
    height: fit-content;
}

.username {
    font-style: italic;
    margin-right: .5rem;
}
</style>

