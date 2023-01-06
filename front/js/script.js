fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(data => {
        showAllProducts(data);
    })


function showAllProducts(data) {
    for (data of data) {
        let display = document.querySelector('#items');
        display.innerHTML +=
            `<a href="./product.html?id=${data._id}">
        <article>
        <img src="${data.imageUrl}" alt="${data.altTxt}">
        <h3 class="productName">${data.name}</h3>
        <p class="productDescription">${data.description}</p>
        </article>
        </a>`;
    }
}