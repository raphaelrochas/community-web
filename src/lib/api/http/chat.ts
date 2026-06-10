import { API_URL } from "../../config"
import type { MessageDTOResp, RoomDTOResp, CreateRoomDTO} from "../type/chat"

export async function createRoom(input: CreateRoomDTO): Promise<RoomDTOResp> {
    const res = await fetch(`${API_URL}/room/create`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(input),
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
    }

    return res.json()
}

export async function joinRoom(roomID: string): Promise<RoomDTOResp> {
    const res = await fetch(`${API_URL}/room/join/${roomID}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(roomID),
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
    }

    return res.json()
}

export async function getRoom(page: number): Promise<RoomDTOResp[]> {
    const res = await fetch(`${API_URL}/room/${page}`, {
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
    }

    const json = await res.json()
    return json.data
}

export async function searchRoom(offset: number, search: string): Promise<RoomDTOResp[]> {
    const res = await fetch(`${API_URL}/room/search/${offset}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({"name": search})
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
    }

    const json = await res.json()
    return json.data
}


export async function getMessage(roomID: string, offset: number): Promise<MessageDTOResp[]> {
    const res = await fetch(`${API_URL}/room/message/${roomID}/${offset}`, {
        headers: {"Content-Type": "application/json"},
        credentials: "include",
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
    }

    const json = await res.json()
    return json.data
}
