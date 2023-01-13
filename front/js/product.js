// Je créé une fonction pour appeler mon api
function callApi() {
    let param = new URLSearchParams(document.location.search);
    let id = param.get("id");
    return fetch(`http://localhost:3000/api/products/${id}`)
}

// J'appelle ma fonction pour afficher mon produit
callApi().then(response => response.json())
    .then(data => {
        showProduct(data);
    })

//C'est le HTML que je vais devoir remplir
let displayImg = document.querySelector('.item__img');
let displayTitle = document.querySelector('#title');
let displayPrice = document.querySelector('#price');
let displayDescription = document.querySelector('#description');
let displayColors = document.querySelector('#colors');

//Ma fonction pour remplir le HTML
function showProduct(data) {

    document.title = data.name;

    displayImg.innerHTML +=
        `<img src="${data.imageUrl}" alt="${data.altTxt}">`;

    displayTitle.innerHTML += data.name;

    displayPrice.innerHTML += data.price;

    displayDescription.innerHTML += data.description;

    for (colors of data.colors) {
        displayColors.innerHTML += `<option value="${colors}">${colors}</option>`
    }

}

//Fonction pour sauvegarder le panier
function saveCart(product) {
    localStorage.setItem("cart", JSON.stringify(product));
}

//Fonction pour récupérer les infos de mon panier
function getCart() {
    let cart = localStorage.getItem("cart");
    //Si aucun cart existant je retourne un tableau vide
    if (cart == null) {
        return [];
    }
    //Sinon je transforme le cart JSON en JS
    else {
        return JSON.parse(cart);
    }
}

//Fonction pour ajouter à mon panier
function addCart(product) {
    // Verification de la quantité et de la couleur
    let checkQuantity = parseInt(document.getElementById('quantity').value);
    let chosenColor = document.getElementById('colors').value;
    if (checkQuantity == 0 || !chosenColor) {
        alert("Vous devez choisir une couleur et une quantité.")
    }
    else if (checkQuantity < 0 || checkQuantity > 100) {
        alert("Vous devez commandé une quantité entre 1 et 100.")
    }

    // On travaille sur le localStorage apres vérification
    else {
        let cart = getCart();
        //petit check afin de ne pas modifier tous les produits a cause de la boucle
        let check = false
        for (p of cart) {
            //Si je reconnais le même produit avec la même couleur alors j'ajoute la quantité saisie
            if (product._id == p._id && chosenColor == p.colors && !check) {
                p.quantity += checkQuantity;
                check = true
            }
        }
        //Si aucun produit ne correspond j'en créer un nouveau et je l'ajoute en supprimant le prix
        if (!check) {
            product.quantity = checkQuantity;
            delete product.price;
            product.colors = chosenColor;
            cart.push(product);
        }
        saveCart(cart);
        alert("Votre produit a été ajouté !")
    }

}

//Sur le click d'ajout je lance ma fonction addCart()
document.getElementById('addToCart').onclick = function () {
    callApi().then(response => response.json())
        .then(data => {
            addCart(data);
        })
}