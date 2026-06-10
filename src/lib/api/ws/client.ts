import { WS_URL } from "../../config";
import type { MessageDTO, MessageDTOResp } from "../type/chat";
import { writable, type Writable } from "svelte/store";

interface WebSocketClient {
    messages: MessageDTOResp[]
    connected: boolean
    error: string | null
}

function Websocket() {
    const { subscribe, set, update }: Writable<WebSocketClient> = writable({
        messages: [],
        connected: false,
        error: null,
    });

    let socket: WebSocket | null = null
    let reconnTimeOut: ReturnType<typeof setTimeout> | null = null

    function connect(roomID: string) {
        if (socket) {
            socket.onclose = null
            socket.close()
            socket = null
        }

        try {
            const ws = new WebSocket(`${WS_URL}/${roomID}`)
            socket = ws

            ws.onopen = () => {
                update(state => ({ ...state, connected: true, error: null }))
            };

            ws.onmessage = (event) => {
                try {
                    const resp = event.data.toString()
                    const message: MessageDTOResp = JSON.parse(resp)
                    update(state => ({
                        ...state,
                        messages: [...state.messages.slice(-50), message],
                    }));
                } catch (err) {
                    console.error("parsing error", err)
                }
            };

            ws.onerror = () => {
                update(state => ({ ...state, error: "error websocket conn" }))
            };

            ws.onclose = (event) => {
                socket = null
                update(state => ({ ...state, connected: false }))

                if (event.code !== 1000 && event.code !== 1008) {
                    reconnTimeOut = setTimeout(() => connect(roomID), 7000)
                }
            };

        } catch (err) {
            console.error("connection error", err);
            update(state => ({ ...state, error: "Connexion impossible" }))
        }
    }

    function disconnect() {
        if (reconnTimeOut) {
            clearTimeout(reconnTimeOut)
            reconnTimeOut = null
        }
        if (socket) {
            socket.onclose = null
            socket.close(1000, "disconnect")
            socket = null
        }
        set({ messages: [], connected: false, error: null })
    }

    function send(input: MessageDTO) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(input))
        } else {
            console.error("websocket not connected")
        }
    }

    function clearMessages() {
        update(state => ({ ...state, messages: [] }))
    }

    return { subscribe, connect, disconnect, send, clearMessages }
}

export const websocket = Websocket()