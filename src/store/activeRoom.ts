import { writable, derived } from "svelte/store";
import type { RoomDTOResp } from "../lib/api/type/chat";
import { API_URL } from "../lib/config";
import { getRoom } from "../lib/api/http/chat";


function createActiveRoomStore() {
    const {subscribe, set} = writable<RoomDTOResp | null>(null)

    function setRoom(room: RoomDTOResp){
        set(room)
    }

    function deleteRoom() {
        set(null)
    }

    return {subscribe, setRoom, deleteRoom}
}

export const activeRoomStore = createActiveRoomStore()