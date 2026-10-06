/* =========================================================
BOCHECHA HAMBURGUERIA
SCRIPT.JS
========================================================= */

/* =========================================================
CONFIGURAÇÕES
========================================================= */

const CONFIG = {

```
// WhatsApp da hamburgueria
// Coloque somente números:
// Brasil +55 + DDD + número
whatsapp: "5500000000000",

// Instagram
instagram: "https://www.instagram.com/",

// Google Maps
localizacao: "https://maps.google.com/",

// Nome que aparecerá no pedido
nomeHamburgueria: "Bochecha Hamburgueria"
```

};

/* =========================================================
ESTADO DO CARRINHO
========================================================= */

let cart = [];

/* =========================================================
ELEMENTOS
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const floatingCart = document.getElementById("floatingCart");

const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartItemsCount =
document.getElementById("cartItemsCount");

const cartTotal =
document.getElementById("cartTotal");

const modalCartTotal =
document.getElementById("modalCartTotal");

const checkoutButton =
document.getElementById("checkoutButton");

const continueShopping =
document.getElementById("continueShopping");

const categoryButtons =
document.querySelectorAll(".category-btn");

const productCards =
document.querySelectorAll(".product-card");

/* =========================================================
CARREGAR CARRINHO
========================================================= */

function loadCart() {

```
try {

    const savedCart =
        localStorage.getItem("bochechaCart");

    if (savedCart) {

        cart = JSON.parse(savedCart);

    }

} catch (error) {

    console.warn(
        "Não foi possível carregar o carrinho.",
        error
    );

    cart = [];

}

updateCart();
```

}

/* =========================================================
SALVAR CARRINHO
========================================================= */

function saveCart() {

```
try {

    localStorage.setItem(
        "bochechaCart",
        JSON.stringify(cart)
    );

} catch (error) {

    console.warn(
        "Não foi possível salvar o carrinho.",
        error
    );

}
```

}

/* =========================================================
CONVERTER PREÇO
========================================================= */

function parsePrice(price) {

```
if (typeof price === "number") {
    return price;
}

if (!price) {
    return 0;
}

let clean = String(price)
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

const number =
    parseFloat(clean);

return Number.isNaN(number)
    ? 0
    : number;
```

}

/* =========================================================
FORMATAR MOEDA
========================================================= */

function formatMoney(value) {

```
return new Intl.NumberFormat(
    "pt-BR",
    {
        style: "currency",
        currency: "BRL"
    }
).format(value);
```

}

/* =========================================================
OBTER PRODUTO DO CARD
========================================================= */

function getProductFromCard(card) {

```
const title =
    card.querySelector("h3")?.textContent
        .trim() || "Produto";

const priceElement =
    card.querySelector(".product-price");

const price =
    parsePrice(
        priceElement?.textContent
    );

const description =
    card.querySelector(".product-content > p")
        ?.textContent
        .trim() || "";

const image =
    card.querySelector("img")?.src || "";

return {

    id: createProductId(title),

    name: title,

    price: price,

    description: description,

    image: image

};
```

}

/* =========================================================
CRIAR ID DO PRODUTO
========================================================= */

function createProductId(name) {

```
return String(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
```

}

/* =========================================================
ADICIONAR PRODUTO
========================================================= */

function addToCart(product) {

```
if (!product || product.price <= 0) {

    alert(
        "Esse produto ainda está sem preço configurado."
    );

    return;

}


const existing =
    cart.find(
        item => item.id === product.id
    );


if (existing) {

    existing.quantity += 1;

} else {

    cart.push({

        id: product.id,

        name: product.name,

        price: product.price,

        description: product.description,

        image: product.image,

        quantity: 1

    });

}


saveCart();

updateCart();

showAddFeedback(product);
```

}

/* =========================================================
FEEDBACK AO ADICIONAR
========================================================= */

function showAddFeedback(product) {

```
const cards =
    document.querySelectorAll(".product-card");

cards.forEach(card => {

    const title =
        card.querySelector("h3")
            ?.textContent.trim();

    if (title === product.name) {

        const button =
            card.querySelector(".product-button");

        if (!button) return;


        const original =
            button.innerHTML;


        button.innerHTML =
            "<span>✓ ADICIONADO</span><span class=\"plus\">✓</span>";


        button.style.background =
            "var(--yellow)";

        button.style.color =
            "var(--dark)";


        setTimeout(() => {

            button.innerHTML =
                original;

            button.style.background =
                "";

            button.style.color =
                "";

        }, 900);

    }

});
```

}

/* =========================================================
AUMENTAR QUANTIDADE
========================================================= */

function increaseQuantity(id) {

```
const item =
    cart.find(
        product => product.id === id
    );

if (!item) return;

item.quantity += 1;

saveCart();

updateCart();
```

}

/* =========================================================
DIMINUIR QUANTIDADE
========================================================= */

function decreaseQuantity(id) {

```
const item =
    cart.find(
        product => product.id === id
    );

if (!item) return;


if (item.quantity > 1) {

    item.quantity -= 1;

} else {

    cart =
        cart.filter(
            product => product.id !== id
        );

}


saveCart();

updateCart();
```

}

/* =========================================================
REMOVER PRODUTO
========================================================= */

function removeFromCart(id) {

```
cart =
    cart.filter(
        item => item.id !== id
    );

saveCart();

updateCart();
```

}

/* =========================================================
QUANTIDADE TOTAL
========================================================= */

function getCartItemsCount() {

```
return cart.reduce(
    (total, item) =>
        total + item.quantity,
    0
);
```

}

/* =========================================================
TOTAL DO CARRINHO
========================================================= */

function getCartTotal() {

```
return cart.reduce(
    (total, item) =>
        total + (item.price * item.quantity),
    0
);
```

}

/* =========================================================
ATUALIZAR CARRINHO
========================================================= */

function updateCart() {

```
const quantity =
    getCartItemsCount();

const total =
    getCartTotal();


if (cartItemsCount) {

    cartItemsCount.textContent =
        quantity;

}


if (cartTotal) {

    cartTotal.textContent =
        formatMoney(total);

}


if (modalCartTotal) {

    modalCartTotal.textContent =
        formatMoney(total);

}


renderCart();
```

}

/* =========================================================
RENDERIZAR CARRINHO
========================================================= */

function renderCart() {

```
if (!cartItems) return;


if (cart.length === 0) {

    cartItems.innerHTML = `

        <div class="cart-empty">

            <span>🍔</span>

            <h3>
                Seu carrinho está vazio
            </h3>

            <p>
                Escolha alguma coisa deliciosa
                no cardápio.
            </p>

            <button
                type="button"
                class="btn btn-primary"
                id="continueShopping">

                VER CARDÁPIO

            </button>

        </div>

    `;


    const button =
        document.getElementById(
            "continueShopping"
        );


    if (button) {

        button.addEventListener(
            "click",
            closeCartModal
        );

    }


    return;

}


cartItems.innerHTML =
    cart.map(item => `

        <div
            class="cart-product"
            data-id="${item.id}">

            <div class="cart-product-image">

                ${
                    item.image

                    ? `<img
                        src="${item.image}"
                        alt="${escapeHTML(item.name)}"
                       >`

                    : `<span>🍔</span>`
                }

            </div>


            <div class="cart-product-info">

                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <small>
                    ${formatMoney(item.price)}
                </small>


                <div class="cart-product-actions">

                    <button
                        type="button"
                        class="quantity-btn"
                        data-cart-action="decrease"
                        data-id="${item.id}">

                        −

                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        type="button"
                        class="quantity-btn"
                        data-cart-action="increase"
                        data-id="${item.id}">

                        +

                    </button>


                    <button
                        type="button"
                        class="remove-btn"
                        data-cart-action="remove"
                        data-id="${item.id}">

                        Remover

                    </button>

                </div>

            </div>


            <strong class="cart-product-total">

                ${formatMoney(
                    item.price * item.quantity
                )}

            </strong>

        </div>

    `).join("");


setupCartActions();
```

}

/* =========================================================
AÇÕES DO CARRINHO
========================================================= */

function setupCartActions() {

```
const buttons =
    cartItems.querySelectorAll(
        "[data-cart-action]"
    );


buttons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const action =
                button.dataset.cartAction;

            const id =
                button.dataset.id;


            if (action === "increase") {

                increaseQuantity(id);

            }


            if (action === "decrease") {

                decreaseQuantity(id);

            }


            if (action === "remove") {

                removeFromCart(id);

            }

        }
    );

});
```

}

/* =========================================================
ESCAPAR HTML
========================================================= */

function escapeHTML(text) {

```
return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
```

}

/* =========================================================
ABRIR CARRINHO
========================================================= */

function openCartModal() {

```
if (!cartModal) return;


cartModal.classList.add("active");

cartModal.setAttribute(
    "aria-hidden",
    "false"
);

document.body.style.overflow =
    "hidden";
```

}

/* =========================================================
FECHAR CARRINHO
========================================================= */

function closeCartModal() {

```
if (!cartModal) return;


cartModal.classList.remove("active");

cartModal.setAttribute(
    "aria-hidden",
    "true"
);

document.body.style.overflow =
    "";
```

}

/* =========================================================
FINALIZAR PEDIDO
========================================================= */

function checkout() {

```
if (cart.length === 0) {

    alert(
        "Seu carrinho está vazio! 🍔"
    );

    return;

}


const total =
    getCartTotal();


let message =
    `🍔 *NOVO PEDIDO — ${CONFIG.nomeHamburgueria}*\n\n`;


cart.forEach(item => {

    const subtotal =
        item.price * item.quantity;


    message +=
        `*${item.quantity}x* ${item.name}\n`;

    message +=
        `   ${formatMoney(subtotal)}\n\n`;

});


message +=
    `━━━━━━━━━━━━━━━━━━\n`;

message +=
    `💰 *TOTAL: ${formatMoney(total)}*\n\n`;

message +=
    `Olá! Gostaria de fazer esse pedido. 😊`;


const encodedMessage =
    encodeURIComponent(message);


const phone =
    CONFIG.whatsapp.replace(/\D/g, "");


if (
    !phone ||
    phone.length < 10
) {

    alert(
        "Configure o número do WhatsApp no início do script.js."
    );

    return;

}


const url =
    `https://wa.me/${phone}?text=${encodedMessage}`;


window.open(
    url,
    "_blank",
    "noopener,noreferrer"
);
```

}

/* =========================================================
FILTRO DE CATEGORIAS
========================================================= */

function filterProducts(category) {

```
productCards.forEach(card => {

    const cardCategory =
        card.dataset.category;


    if (
        category === "todos" ||
        cardCategory === category
    ) {

        card.style.display = "";

        requestAnimationFrame(() => {

            card.style.opacity = "1";
            card.style.transform =
                "translateY(0)";

        });

    } else {

        card.style.opacity = "0";
        card.style.transform =
            "translateY(10px)";


        setTimeout(() => {

            if (
                card.dataset.category !== category &&
                category !== "todos"
            ) {

                card.style.display =
                    "none";

            }

        }, 180);

    }

});
```

}

/* =========================================================
MENU MOBILE
========================================================= */

function toggleMobileMenu() {

```
if (!mainNav) return;


mainNav.classList.toggle("active");
```

}

function closeMobileMenu() {

```
if (!mainNav) return;

mainNav.classList.remove("active");
```

}

/* =========================================================
LINKS CONFIGURÁVEIS
========================================================= */

function setupLinks() {

```
const whatsappLinks =
    document.querySelectorAll(
        "#whatsappLink, #footerWhatsapp"
    );


whatsappLinks.forEach(link => {

    link.href =
        `https://wa.me/${CONFIG.whatsapp.replace(/\D/g, "")}`;

    link.target =
        "_blank";

    link.rel =
        "noopener noreferrer";

});


const instagramLinks =
    document.querySelectorAll(
        "#instagramLink, #footerInstagram"
    );


instagramLinks.forEach(link => {

    link.href =
        CONFIG.instagram;

    link.target =
        "_blank";

    link.rel =
        "noopener noreferrer";

});


const locationLink =
    document.getElementById(
        "locationLink"
    );


if (locationLink) {

    locationLink.href =
        CONFIG.localizacao;

    locationLink.target =
        "_blank";

    locationLink.rel =
        "noopener noreferrer";

}
```

}

/* =========================================================
EVENTOS — PRODUTOS
========================================================= */

function setupProductButtons() {

```
productCards.forEach(card => {

    const button =
        card.querySelector(
            ".product-button"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const product =
                getProductFromCard(card);

            addToCart(product);

        }
    );

});
```

}

/* =========================================================
EVENTOS — CATEGORIAS
========================================================= */

function setupCategoryButtons() {

```
categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(
                btn =>
                    btn.classList.remove("active")
            );


            button.classList.add("active");


            const category =
                button.dataset.category ||
                "todos";


            filterProducts(category);

        }
    );

});
```

}

/* =========================================================
FECHAR MODAL CLICANDO FORA
========================================================= */

function setupModal() {

```
if (!cartModal) return;


cartModal.addEventListener(
    "click",
    event => {

        if (
            event.target === cartModal
        ) {

            closeCartModal();

        }

    }
);
```

}

/* =========================================================
TECLA ESC
========================================================= */

function setupKeyboard() {

```
document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeCartModal();

            closeMobileMenu();

        }

    }
);
```

}

/* =========================================================
FECHAR MENU AO CLICAR EM LINK
========================================================= */

function setupNavigation() {

```
if (!mainNav) return;


const links =
    mainNav.querySelectorAll("a");


links.forEach(link => {

    link.addEventListener(
        "click",
        closeMobileMenu
    );

});
```

}

/* =========================================================
ANIMAÇÃO DE SCROLL
========================================================= */

function setupScrollReveal() {

```
const elements =
    document.querySelectorAll(
        ".product-card, .contact-card, .about-card, .featured-content, .hero-content"
    );


if (
    !("IntersectionObserver" in window)
) {

    return;

}


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.08
        }
    );


elements.forEach(element => {

    element.classList.add(
        "scroll-reveal"
    );

    observer.observe(element);

});
```

}

/* =========================================================
CONTROLE DO SCROLL DO HEADER
========================================================= */

function setupHeaderScroll() {

```
const header =
    document.querySelector(
        ".site-header"
    );


if (!header) return;


window.addEventListener(
    "scroll",
    () => {

        if (
            window.scrollY > 30
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    },
    {
        passive: true
    }
);
```

}

/* =========================================================
INICIALIZAÇÃO
========================================================= */

function init() {

```
setupProductButtons();

setupCategoryButtons();

setupModal();

setupKeyboard();

setupNavigation();

setupLinks();

setupScrollReveal();

setupHeaderScroll();


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );

}


if (floatingCart) {

    floatingCart.addEventListener(
        "click",
        openCartModal
    );

}


if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartModal
    );

}


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        checkout
    );

}


loadCart();
```

}

/* =========================================================
INICIAR
========================================================= */

if (
document.readyState === "loading"
) {

```
document.addEventListener(
    "DOMContentLoaded",
    init
);
```

} else {

```
init();
```

}
