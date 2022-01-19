
// Fonction d'appel de l'api avec get ou post

function getApi(url, option, request) {
    
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

// fonction permet de calculer la quantitée et le prix total de tout les produits dans le local storage

async function priceAndQuantity_calculation() {

    let tota_price = 0;
    let total_quantity = 0;
    const totalPrice = document.querySelector("#totalPrice");
    const totalQuantity = document.querySelector("#totalQuantity")
    
    for (i = 0; i < localStorage.length; i++) {
        const localStorage_array = localStorage.getItem(localStorage.key(i)).split(",");
        const data = await getApi(`http://localhost:3000/api/products/${localStorage_array[0]}`, "get")
        total_price = total_price + (parseInt(data.price, 10) * parseInt(localStorage_array[2], 10))
        total_quantity = total_quantity + parseInt(localStorage_array[2], 10);
    }

    totalPrice.innerHTML = total_price;
    totalQuantity.innerHTML = total_quantity;
}

// Fonction crée une carte pour chaque produit present dans le local storage 

async function createCart() {

    for (i = 0; i < localStorage.length; i++) {
        
        const cart_items = document.querySelector("#cart__items")
        const localStorage_array = localStorage.getItem(localStorage.key(i)).split(",");
        const data = await getApi(`http://localhost:3000/api/products/${localStorage_array[0]}`, "get")
        const product = `
            <article class="cart__item" data-id="${localStorage_array[0]}" data-color="${localStorage_array[1]}">
                <div class="cart__item__img">
                    <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${data.name}</h2>
                        <p>${localStorage_array[1]}</p>
                        <p>${data.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorage_array[2]}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
        </article>
        `
        cart_items.insertAdjacentHTML("beforeend", product);
    }

    priceAndQuantity_calculation()
    updateCartStorage()
}

// Fonction detecte des changement dans le local storage afin de recalculer le prix et la quantitée total des produit 

async function updateCartStorage() {
    
    const deleteItems = document.querySelectorAll(".deleteItem");
    const itemsQuantity = document.querySelectorAll(".itemQuantity")
    
    for (let deleteItem of deleteItems) {

        deleteItem.addEventListener("click", () => {
            
            const item = deleteItem.closest(".cart__item")
            localStorage.removeItem(item.dataset.id + item.dataset.color )
            item.remove()
            priceAndQuantity_calculation()
        })
    }
    for (let itemQuantity of itemsQuantity) {

        itemQuantity.addEventListener("change", () => {

            console.log(itemQuantity.value);
            const item = itemQuantity.closest(".cart__item")
            const new_item = [item.dataset.id,item.dataset.color,itemQuantity.value];
            localStorage.removeItem(item.dataset.id + item.dataset.color)
            localStorage.setItem(item.dataset.id + item.dataset.color, new_item)
            priceAndQuantity_calculation()
        })
    }
}

// Fonction permet de verifier que le formulaire est corectement rempli 

function formVerification(input, msgBalise, type) {
    if (type === "text") {
        
        msgBalise.textContent = "";

        const regex = /^[A-Za-z][-a-zA-Z]+$/g;
        if (regex.test(input.value) === false) {
            msgBalise.textContent = "Format invalide"
            return false;
        } else {
            return true;
        }

    } else if (type === "adress") {
        
        msgBalise.textContent = "";

        const regex = /^\d+\s[A-z]+\s[A-z]+/g;
        if (regex.test(input.value) === false) {
            msgBalise.textContent = "Format invalide"
            return false;
        } else {
            return true;
        }

    } else {
        
        msgBalise.textContent = "";

        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (regex.test(input.value) === false) {
            msgBalise.textContent = "Format invalide"
            return false;
        } else {   
            return true;
        }
        
    }
    
}

// fonction permet de faire un tableau de tout les id produit pour une requete vers l'api

function arrayProductId() {

    let array = [];

    for (i = 0; i < localStorage.length; i++) {
        
        const localStorage_array = localStorage.getItem(localStorage.key(i)).split(",");
        array.push(localStorage_array[0])
    }

    return array;     
}

// Fonction permet de faire la requete post vers l'api en passant commande

async function order(e) {

    const firstName = document.querySelector("#firstName");  
    const lastName = document.querySelector("#lastName");  
    const address = document.querySelector("#address");  
    const city = document.querySelector("#city");  
    const email = document.querySelector("#email");  
    const firstNameErrorMessage = document.querySelector("#firstNameErrorMsg");  
    const lastNameErrorMessage = document.querySelector("#lastNameErrorMsg");  
    const addressErrorMessage = document.querySelector("#addressErrorMsg");  
    const cityErrorMessage = document.querySelector("#cityErrorMsg");  
    const emailErrorMessage = document.querySelector("#emailErrorMsg"); 
    
    if (formVerification(firstName, firstNameErrorMessage, "text") === true && formVerification(lastName, lastNameErrorMessage, "text") === true && formVerification(address, addressErrorMessage, "adress") === true && formVerification(city, cityErrorMessage, "text") === true && formVerification(email, emailErrorMessage, "email") === true) {
        e.preventDefault()
        const request = {
            contact: {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value
                },
            products: arrayProductId()  
        }
        const orderId = await getApi("http://localhost:3000/api/products/order", "post", request);  
        document.location.href = `../html/confirmation.html?id=${orderId}`
        } else {
            e.preventDefault()
        }
}

document.querySelector("form").addEventListener("submit", (e) => {
     order(e);   
})

createCart()