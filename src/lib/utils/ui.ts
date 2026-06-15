export async function scrollBot(container: HTMLElement | null) {
    if (!container){
        console.log("test")
        return 
    } 
    container.scrollTop = container.scrollHeight
}