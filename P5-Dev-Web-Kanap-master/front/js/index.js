// Fonction d'appel de l'api avec get ou post

function getApi(url, option,request) {
    
    if (option === "get") {
        return fetch(url)
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.error(err.message)
        })
    }

    if (option === "post") {
        return fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request),
        }).then(response => { 
            return response.json();
        }).then(data => {
            return data.orderId;
        })
    }
}

// Fonction creée une carte de tout les produit existant dans l'api
async function createCard() {

    let data = await getApi("http://localhost:3000/api/products", "get");
    let card_container = document.querySelector(".items")

    for (i = 0; i < data.length; i++) {

        const card = `
        <a href="./product.html?id=${data[i]._id}">
            <article>
                <img src="${data[i].imageUrl}" alt="${data[i].altTxt}">
                <h3 class="productName">${data[i].name}</h3>
                <p class="productDescription">${data[i].description}</p>
            </article>
        </a>
        `;  
        card_container.insertAdjacentHTML("beforeend", card);
    }
}

createCard();