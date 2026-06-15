import { writable, derived } from "svelte/store";
import type { JoinRoomDTO, RoomDTOResp } from "../lib/api/type/chat";
import { API_URL } from "../lib/config";
import { getRoom } from "../lib/api/http/chat";

interface RoomStore {
    rooms: RoomDTOResp[]
    isLoading: boolean
    error: string | null
    page: number
}

function createRoomStore() {
    const {subscribe, set, update} = writable<RoomStore>({
        rooms: [],
        isLoading: false,
        error: null,
        page: 0
    })

    function joinedRooms(room: JoinRoomDTO) {
        update(state => ({...state, rooms: state.rooms.map(r => r.id === room.room_id ? {...r, is_joined: true} : r)}))
    }

    async function fetchRooms(page: number = 0) {
        update(state => ({...state, isLoading: true, error: null}))

        try {
            const data = await getRoom(page)
            update(state => ({...state, rooms: data, isLoading: false, page,}))
        } catch {
            update(state => ({...state, isLoading: false, error: "failed to fetch the rooms"}))
        }
    }
    return {subscribe, fetchRooms, joinedRooms}
}

export const roomStore = createRoomStore()