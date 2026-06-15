export type AddRoomDTOResp = {
    id: string,
    name: string,
}

export type CreateRoomDTO = {
    name: string,
    password: string,
}

export type RoomDTOResp = {
    id: string,
    name: string,
    members: number, 
    created_at: string,
    is_joined: boolean,
    is_public: boolean,
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

export type JoinRoomDTO = {
    room_id: string,
    password: string,
}

