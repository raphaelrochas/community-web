import type { MessageDTO } from "./chat"

export type WebSocketClientResp = {
    socket: WebSocket | null
    messages: MessageDTO[]
    connected: boolean
    error: string
}