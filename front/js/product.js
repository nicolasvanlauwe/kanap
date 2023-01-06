let param = new URLSearchParams(document.location.search);
let id = param.get("id");

fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(data => {
        showProduct(data);
        // console.log(data);
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