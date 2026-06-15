<script lang="ts">
import {activeRoomStore} from "../../../store/activeRoom"
</script>

<div class="header-wrap">
    <h1>Community</h1>
    <div class="header-button-wrapper">
        <button>Rooms</button>
        <button>My rooms</button>
    </div>
</div>

<style>
.header-wrap {
    display: flex;
    flex-direction: column;
    margin: 1rem;
}

.header-wrap h1 {
    align-self: center;
    font-style: italic;
}

.header-wrap .header-button-wrapper {
    gap: 1rem;
}

.header-wrap button  {
    font-size: small;
    width: 5rem;
    white-space: nowrap;
    
}


</style>
