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
    function testForm(str, reg, locMsg, msg) {
      str.addEventListener('input', () => {
        if (!reg.test(str.value)) {
          document.getElementById(locMsg).textContent = msg
        }
        else {
          document.getElementById(locMsg).textContent = ""
        }
      })
    }

    let validBtn = document.getElementById('order')
    let firstName = document.getElementById('firstName')
    let lastName = document.getElementById('lastName')
    let address = document.getElementById('address')
    let city = document.getElementById('city')
    let email = document.getElementById('email')

    let nameReg = new RegExp(/^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/);
    let addressReg = new RegExp(/^[0-9 A-Za-z'-]{1,40}$/);
    let emailReg = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-z]{2,3})$/);
    testForm(firstName, nameReg, 'firstNameErrorMsg', "Vous ne pouvez pas utilisez de caractères spéciaux");
    testForm(lastName, nameReg, 'lastNameErrorMsg', "Vous ne pouvez pas utilisez de caractères spéciaux");
    testForm(address, addressReg, 'addressErrorMsg', "L'adresse n'est pas conforme");
    testForm(city, nameReg, 'cityErrorMsg', "Vous ne pouvez pas utilisez de caractères spéciaux");
    testForm(email, emailReg, 'emailErrorMsg', "L'adresse mail n'est pas conforme");

    validBtn.addEventListener("click", (event) => {
      let cart = getCart();
      if (!nameReg.test(firstName.value) ||
        !nameReg.test(lastName.value) ||
        !addressReg.test(address.value) ||
        !nameReg.test(city.value) ||
        cart.length == 0) {
        event.preventDefault();
        alert('Les champs du formulaire sont incorrects ou votre panier est vide')
      }

      else {
        let cartConfirm = [];
        for (p of cart) {
          cartConfirm.push(p._id);
          console.log(p._id)
        }
        let order = {
          //données form
          infoForm: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
          },
          //données panier
          infoCart: cartConfirm
        }
        console.log(order)
        fetch('http://localhost:3000/api/products/order', {
          method: 'POST',
          body: JSON.stringify(order),
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          }
        })
          .then((response) => response.json())
          .then((data) => {
            let orderId = data.orderId
            window.location.href = "confirmation.html" + "?orderId=" + orderId
          })
      }
    })
  })










