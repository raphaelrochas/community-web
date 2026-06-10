export type AddRoomDTOResp = {
    id: string,
    name: string,
}

export type CreateRoomDTO = {
    name: string,
}

export type RoomDTOResp = {
    id: string,
    name: string,
    members: number, 
    created_at: string,
    is_joined: boolean
}

export type MessageDTO = {
    content: string,
}

export type MessageDTOResp = {
    id: number,
    content: string,
    sender_username: string,
    created_at: string,
}

