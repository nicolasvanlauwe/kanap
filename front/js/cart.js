function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    return [];
  }
  else {
    return JSON.parse(cart);
  }
}

function saveCart(product) {
  localStorage.setItem("cart", JSON.stringify(product));
}

let cart = getCart();
let displayCart = document.querySelector('#cart__items');
let displayTotalQuantity = document.querySelector('#totalQuantity');
let displayTotalPrice = document.querySelector('#totalPrice');
let totQuantity = 0;
let totPrice = 0;

fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(data => {

    //exploration du localStorage
    for (p of cart) {
      //on recherche le prix dans l'api
      let price;
      //exploration de l'api pour trouver le prix de l'article
      for (o of data) {
        if (o._id == p._id) {
          price = o.price
        }
      }
      displayCart.innerHTML += `<article class="cart__item" data-id="${p._id}" data-color="${p.colors}">
    <div class="cart__item__img">
      <img src="${p.imageUrl}" alt="${p.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${p.name}</h2>
        <p>${p.colors}</p>
        <p>${price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${p.quantity}</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${p.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
      totQuantity += p.quantity;
      totPrice += price * p.quantity;
    }
    displayTotalQuantity.innerHTML += totQuantity;
    displayTotalPrice.innerHTML += totPrice;

    //changement de quantité

    let inputQuantity = document.querySelectorAll('.itemQuantity');
    for (let i = 0; i < inputQuantity.length; i++) {
      inputQuantity[i].addEventListener('change', () => {
        let cart = getCart();
        cart[i].quantity = inputQuantity[i].value
        saveCart(cart);
        window.location.href = "cart.html"
        alert("La quantité a bien été changé !")
      })
    }


    //suppression d'un article

    let deleteBtn = document.querySelectorAll('.deleteItem');

    for (let l = 0; l < deleteBtn.length; l++) {
      deleteBtn[l].addEventListener('click', () => {
        let cart = getCart();
        let deleteId = cart[l]._id;
        cart = cart.filter((f) => f._id !== deleteId)
        saveCart(cart);
        window.location.href = "cart.html"
        alert("Votre produit a été supprimé !")
      })
    }

    //Verification du formulaire

    let validBtn = document.getElementById('order')
    validBtn.addEventListener("click", (event) => {
      if (!isNaN(document.getElementById('firstName').value) || !isNaN(document.getElementById('lastName').value)) {
        event.preventDefault();
        alert("Veuillez entrer un nom et prénom valide.")
      }
    })
  })










