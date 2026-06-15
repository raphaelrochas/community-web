import { writable, derived } from "svelte/store";
import type { User } from "../lib/api/type/auth";
import { API_URL } from "../lib/config";

interface UserStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

function createUserStore() {
    const { subscribe, set, update } = writable<UserStore>({
        user: null,
        isAuthenticated: false,
        isLoading: true
    })

    function setUser(data: User) {
        set({ user: data, isAuthenticated: true, isLoading: false });
    }

    function deleteUser() {
        set({ user: null, isAuthenticated: false, isLoading: false });
    }

    async function checkAuth() {
        try {
            const resp = await fetch(`${API_URL}/auth/me`, {
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            })

            if (!resp.ok) {
                deleteUser()
                return
            }

            const data = await resp.json()
            setUser({userID: data.user_id, username: data.username})
        } catch {
            deleteUser()
        }
    }

    return { subscribe, setUser, deleteUser, checkAuth};
}

export const userStore = createUserStore()
export const currentUser = derived(userStore, $store => $store.user)