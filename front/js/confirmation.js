let param = new URLSearchParams(window.location.search);
//On récupère l'orderID et on l'ajoute au HTML
document.getElementById('orderId').innerHTML = param.get('orderId');
//On clear le panier
window.localStorage.clear();