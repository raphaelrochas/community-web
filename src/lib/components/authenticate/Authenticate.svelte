<script lang="ts">
import type {AuthDTO, AuthDTOResp} from "../../api/type/auth"
import { login, register } from "../../api/http/auth"
import {isEqual, isEmpty} from "../../utils/check"

let inputLogin: AuthDTO = $state({username: "", password: ""})
let inputRegister: AuthDTO = $state({username: "", password: ""})
let passwordCheck: string = $state("")

let error: any = $state("")
let succes: boolean = $state(false)

let isRegister: boolean = $state(false)
let isLoading: boolean = $state(false)


async function handleRegister(e: Event) {
    e.preventDefault()
    isLoading = true

    if (!isEmpty(inputRegister.username, 3)) {
        error = "username must ne atleast 3 chars"
        return
    }
    if (!isEmpty(inputRegister.password, 5)) {
        error = "password must ne atleast 5 chars"
        return
    }
    if (!isEqual(passwordCheck, inputRegister.password)) {
            error = "not the same password"
            return
    }

    try {
        await register(inputRegister)
        succes = true
    } catch (err: any) {
        error = err
        isLoading = false
    }
}

async function handleLogin(e: Event) {
    e.preventDefault()
    isLoading = true
    
    if (!isEmpty(inputLogin.password, 5)) {
        error = "the password must be atleast 5 chars"
        return
    }
    if (!isEmpty(inputLogin.username, 3)) {
        error = "the username must be atleast 5 chars"
        return
    }
    
    try {
        await login(inputLogin)
        succes = true
    } catch (err: any) {
        error = err
        isLoading = false
    }
}
    
</script>

<section class="auth">
    <h2>authentificate</h2>
    {#if (isRegister === false)}
        <form onsubmit={handleLogin}>
            <input type="text" placeholder="username" bind:value={inputLogin.username} required>
            <input type="password" placeholder="password" bind:value={inputLogin.password} required>
            <button disabled={isLoading}>Connection</button>
            <button onclick={() => isRegister=true}>Create an account</button>
        </form>
    {/if}
    {#if isRegister === true}
        <form onsubmit={handleRegister}>
            <input type="text" placeholder="username" bind:value={inputRegister.username}>
            <input type="password" placeholder="password" bind:value={inputRegister.password}>
            <input type="password" placeholder="confirm password" bind:value={passwordCheck}>
            <button disabled={isLoading}>Register</button>
            <button onclick={() => isRegister=false}>Login</button>
        </form>
    {/if}
    {#if (succes === true)}
        <p>logged succesfully</p>
    {:else}
        <p class="red">{error}</p>   
    {/if} 
</section>