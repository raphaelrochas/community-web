import { API_URL } from "../../config"
import type { AuthDTO, AuthDTOResp } from "../type/auth"
import { userStore } from "../../../store/user"

export async function register(input: AuthDTO): Promise<AuthDTOResp>  {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(input),
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
    }

    const data: AuthDTOResp =  await res.json()
    userStore.setUser({userID: data.id, username: data.username })
    return data;
}

export async function login(input: AuthDTO): Promise<AuthDTOResp>  {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(input),
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
    }

    const data: AuthDTOResp = await res.json()
    userStore.setUser({userID: data.id, username: data.username})
    return data
}