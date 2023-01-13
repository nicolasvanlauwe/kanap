let display = document.querySelector('#items');
//Contact de l'API
fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(data => {
        // Appel de la fonction avec comme paramètre le contenu de l'API
        showAllProducts(data);
    })
    .catch(() => {
        display.innerHTML += "<h1>Problème avec l'API</h1>"
    })


function showAllProducts(data) {
    //On parcourt et on ajoute au fur et à mesure
    for (d of data) {

        display.innerHTML +=
            `<a href="./product.html?id=${d._id}">
        <article>
        <img src="${d.imageUrl}" alt="${d.altTxt}">
        <h3 class="productName">${d.name}</h3>
        <p class="productDescription">${d.description}</p>
        </article>
        </a>`;
    }
}