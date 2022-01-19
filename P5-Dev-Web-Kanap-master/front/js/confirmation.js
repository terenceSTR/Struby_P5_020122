// Fonction permettant l'affichage de l'id de la commande

function getOrderId() {

    const orderId = document.querySelector("#orderId")
    
    let url = new URL(window.location);
    let id = url.searchParams.get("id");
    orderId.innerHTML = id;
    history.pushState({}, null, "../html/confirmation.html");
}
getOrderId()