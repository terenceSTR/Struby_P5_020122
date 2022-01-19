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

// fonction recupere l'id du produit dans le lien de la page

function getIdProduct() {

    let url = new URL(window.location);
    let id = url.searchParams.get("id");
    return id;
}

// Fonction permettant de créer la page avec les données du produit depuis l'api

async function createProduct() {

    const data = await getApi(`http://localhost:3000/api/products/${getIdProduct()}`, "get");
    const item_img = document.querySelector(".item__img").innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    const title = document.querySelector("#title").innerHTML = `${data.name}`;
    const price = document.querySelector("#price").innerHTML = `${data.price}`;
    const description = document.querySelector("#description").innerHTML = `${data.description}`;
    const colors_array = data.colors;

    for (i = 0; i < colors_array.length; i++) {

        const colors = document.querySelector("#colors");
        const colorValue = `<option value="${data.colors[i]}">${data.colors[i]}</option>`
        colors.insertAdjacentHTML("beforeend", colorValue);
    }
}

// Fonction permettant de comparer un nouvel ajout dans le local storage avec les produit deja existant

function compareProduct(id, colors, quantity) {
    
    if (localStorage.length === 0) {
        return [id,colors,quantity];
    }

    for (i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === id + colors) {

            const localStorage_array = localStorage.getItem(localStorage.key(id + colors)).split(",");
            const new_quantity = parseInt(quantity) + parseInt(localStorage_array[2], 10)
            localStorage.removeItem(localStorage.key(i))
            console.log(parseInt(quantity), parseInt(localStorage_array[2], 10), new_quantity);
            return [id,colors,new_quantity]
        } 
    } 
    
    return [id,colors,quantity];
}

// Fonction permettant d'ajouter un produit au local storage 

async function setLocalStorage() {

    const add = document.querySelector("#addToCart");
    
    add.addEventListener("click", () => {

        const colors = document.querySelector("#colors").value;
        const quantity = document.querySelector("#quantity").value;
        const id = getIdProduct(); 
        if (quantity != 0 && colors != "") {
            
            localStorage.setItem(id + colors, compareProduct(id, colors, quantity))
        }
    })
}

createProduct()
setLocalStorage()