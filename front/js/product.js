function callApi() {
    let param = new URLSearchParams(document.location.search);
    let id = param.get("id");

    return fetch(`http://localhost:3000/api/products/${id}`)
}
callApi().then(response => response.json())
    .then(data => {
        showProduct(data);
    })


let displayImg = document.querySelector('.item__img');
let displayTitle = document.querySelector('#title');
let displayPrice = document.querySelector('#price');
let displayDescription = document.querySelector('#description');
let displayColors = document.querySelector('#colors');


function showProduct(data) {

    displayImg.innerHTML +=
        `<img src="${data.imageUrl}" alt="${data.altTxt}">`;

    displayTitle.innerHTML += data.name;

    displayPrice.innerHTML += data.price;

    displayDescription.innerHTML += data.description;

    for (colors of data.colors) {
        displayColors.innerHTML += `<option value="${colors}">${colors}</option>`
    }

}

// Fonction pour le panier
let checkQuantity = document.getElementById('quantity').value;


function saveCart(product) {

    localStorage.setItem("cart", JSON.stringify(product));

}

function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    }
    else {
        return JSON.parse(cart);
    }
}

function addCart(product) {
    // Verification de la quantité
    let checkQuantity = parseInt(document.getElementById('quantity').value);
    let chosenColor = document.getElementById('colors').value;
    if (checkQuantity == 0 || !chosenColor) {
        alert("Vous devez choisir une couleur et une quantité.")
    } else {
        let cart = getCart();
        let searchProduct = cart.find(p => p._id == product._id);
        // console.log(searchProduct)
        // console.log(searchProduct.colors == chosenColor)
        // console.log("couleur produit cherche" + searchProduct.colors)
        // console.log("couleur choisi" + chosenColor)
        let check = false
        for (p of cart) {
            if (product._id == p._id && chosenColor == p.colors && !check) {
                console.log("victoire")
                p.quantity += checkQuantity;
                check = true
            }
        }
        if (!check) {
            product.quantity = checkQuantity;
            delete product.price;
            product.colors = chosenColor;
            cart.push(product);
        }
        saveCart(cart);
    }


}

document.getElementById('addToCart').onclick = function () {
    callApi().then(response => response.json())
        .then(data => {
            addCart(data);
        })
}