//Je ressort mes fonctions du panier 
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
//On travaille sur le HTML que l'on va afficher
let displayCart = document.querySelector('#cart__items');
let displayTotalQuantity = document.querySelector('#totalQuantity');
let displayTotalPrice = document.querySelector('#totalPrice');
let totQuantity = 0;
let totPrice = 0;

//J'appelle mon API pour retrouver les prix
fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(data => {

    //exploration du localStorage
    for (p of cart) {
      let price;
      //exploration de l'api pour trouver le prix de l'article
      for (o of data) {
        //Si les ids correspondent alors on a le prix
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
      //Incrémentation de mon total pour le prix et pour la quantité
      totQuantity += parseInt(p.quantity);
      totPrice += price * p.quantity;
    }
    //On affiche après la boucle les totaux
    displayTotalQuantity.innerHTML += totQuantity;
    displayTotalPrice.innerHTML += totPrice;

    //Travail sur le changement de quantité
    let inputQuantity = document.querySelectorAll('.itemQuantity');
    for (let i = 0; i < inputQuantity.length; i++) {
      //Dés qu'on détecte un changement
      inputQuantity[i].addEventListener('change', () => {
        let cart = getCart();
        //Si on a mit la quantité à 0 alors on supprime le produit
        if (inputQuantity[i].value == 0) {
          cart.splice(i, 1);
          saveCart(cart);
          window.location.href = "cart.html"
          alert("Le produit a bien été supprimé !")
        }
        //On check tjrs que les quantités sont dans les normes
        else if (inputQuantity[i].value < 0 || inputQuantity[i].value > 100) {
          alert("Veuillez commandez une quantité entre 1 et 100.")
        }
        //Si tout est ok on actualise la quantité et on refresh la page 
        else {
          cart[i].quantity = inputQuantity[i].value
          saveCart(cart);
          window.location.href = "cart.html"
          alert("La quantité a bien été changé !")
        }
      })
    }


    //Travail sur la suppression d'un article
    let deleteBtn = document.querySelectorAll('.deleteItem');

    for (let l = 0; l < deleteBtn.length; l++) {
      deleteBtn[l].addEventListener('click', () => {
        let cart = getCart();
        //La posistion du btn supprimer est lié au produit donc on supprime à l
        cart.splice(l, 1);
        //On enregistre et on refresh
        saveCart(cart);
        window.location.href = "cart.html"
        alert("Votre produit a été supprimé !")
      })
    }

    //Fonction pour tester la conformité des champs du formulaire
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

    //Les champs à tester
    let firstName = document.getElementById('firstName')
    let lastName = document.getElementById('lastName')
    let address = document.getElementById('address')
    let city = document.getElementById('city')
    let email = document.getElementById('email')

    //Les regexp pour tester
    let nameReg = new RegExp(/^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/);
    let addressReg = new RegExp(/^[0-9 A-Za-z'-]{1,40}$/);
    let emailReg = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-z]{2,3})$/);

    testForm(firstName, nameReg, 'firstNameErrorMsg', "Vous ne pouvez pas utilisez de caractères spéciaux et le champ ne peut pas être vide");
    testForm(lastName, nameReg, 'lastNameErrorMsg', "Vous ne pouvez pas utilisez de caractères spéciaux et le champ ne peut pas être vide");
    testForm(address, addressReg, 'addressErrorMsg', "L'adresse n'est pas conforme et le champ ne peut pas être vide");
    testForm(city, nameReg, 'cityErrorMsg', "Vous ne pouvez pas utilisez de caractères spéciaux et le champ ne peut pas être vide");
    testForm(email, emailReg, 'emailErrorMsg', "L'adresse mail n'est pas conforme et le champ ne peut pas être vide");


    //Envoi de la commande
    validBtn.addEventListener("click", (event) => {
      let cart = getCart();
      //Si panier vide on bloque
      if (cart.length == 0) {
        event.preventDefault();
        alert('Votre panier est vide')
      }
      //Si message d'erreur au formulaire on bloque
      else if (document.getElementById('firstNameErrorMsg').textContent !== "" ||
        document.getElementById('lastNameErrorMsg').textContent !== "" ||
        document.getElementById('addressErrorMsg').textContent !== "" ||
        document.getElementById('cityErrorMsg').textContent !== "" ||
        document.getElementById('emailErrorMsg').textContent !== "") {
        event.preventDefault();
      }
      //Si champ vide on le signale et on bloque
      else if (document.getElementById('firstName').value == "" ||
        document.getElementById('lastName').value == "" ||
        document.getElementById('address').value == "" ||
        document.getElementById('city').value == "" ||
        document.getElementById('email').value == "") {
        event.preventDefault();
        alert("Les champs ne peuvent pas être vides.")
      }
      //Si tout est ok on avance
      else {
        //On enregistre les données à envoyer à l'API
        let cartConfirm = [];
        for (p of cart) {
          cartConfirm.push(p._id);
        }
        let order = {
          //données form
          contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
          },
          //données panier
          products: cartConfirm
        }
        //On envoie nos infos à l'API
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
            //On enregistre l'orderId et on le met dans le lien
            let orderId = data.orderId
            window.location.href = "confirmation.html" + "?orderId=" + orderId
          })
      }
    })
  })
