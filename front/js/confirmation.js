let param = new URLSearchParams(window.location.search);

document.getElementById('orderId').innerHTML = param.get('orderId');

window.localStorage.clear();