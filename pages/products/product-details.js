/* =========================================================
   FLORA AVENUE
   PRODUCT DETAILS JAVASCRIPT
   ========================================================= */


/* =========================================================
   PRODUCT DATA
   ========================================================= */

const products = {

    /* =========================
       FLOWERS
    ========================= */

    "plain-tulip-satin": {
        name: "Plain Tulip / Satin Rose",
        description:
            "A beautiful handmade satin rose bouquet, perfect for gifts and special occasions.",
        folder: "plain-tulip-satin",
        colors: [
            "light-red",
            "blue",
            "purple",
            "pink"
        ],
        price: 45
    },

    "satin-rose": {
        name: "Satin Rose Bouquet",
        description:
            "Handmade satin rose bouquet available in different sizes, colors, and styles.",
        folder: "satin-rose",
        colors: [
            "red",
            "pink",
            "violet",
            "blue"
        ],
        price: 69
    },

    "eternal-rose": {
        name: "Eternal Glittered Rose",
        description:
            "A beautiful Eternal glittered Rose perfect for any special occasion.",
        folder: "eternal-rose",
        colors: [
            "red",
            "blue",
            "purple",
            "pink"
        ],
        price: 749
    },

    "sunflower": {
        name: "Sunflower Bouquet",
        description:
            "A cheerful sunflower bouquet perfect for gifts and special occasions.",
        folder: "sunflower",
        colors: [],
        price: 119
    },

    "artificial-tulip": {
        name: "Artificial Tulip Bouquet",
        description:
            "Beautiful artificial tulip bouquet available in different quantities and colors.",
        folder: "artificial-tulip",
        colors: [
            "pink",
            "white",
            "purple",
            "yellow"
        ],
        price: 119
    },

    "roria": {
        name: "Roria",
        description:
            "A beautiful flower arrangement from Flora Avenue.",
        folder: "roria",
        colors: [],
        price: 450
    },

    "amore": {
        name: "Amore Blooms",
        description:
            "A beautiful mixed flower bouquet available in different designs.",
        folder: "amore",
        colors: [],
        price: 550
    },

    "thumbelina": {
        name: "Thumbelina",
        description:
            "A lovely flower arrangement from Flora Avenue.",
        folder: "thumbelina",
        colors: [],
        price: 749
    },

    "dahlia": {
        name: "Dahlia Satin Rose",
        description:
            "A handmade Dahlia satin rose bouquet, perfect for thoughtful gifts and special moments.",
        folder: "dahlia",
        colors: [
            "pink",
            "red",
            "violet"
        ],
        price: 119
    },

    "butterfly-flowers": {
        name: "Butterfly × Flowers",
        description:
            "A lovely flower bouquet mixed with butterflies and lights.",
        folder: "butterfly-flowers",
        colors: [
            "pink",
            "red",
            "violet",
            "blue"
        ],
        price: 260
    },


    /* =========================
       BOUQUETS
    ========================= */

    "butterfly-bouquet": {
        name: "Butterfly Bouquet with Lights",
        description:
            "A charming butterfly bouquet decorated with beautiful fairy lights.",
        folder: "butterfly-bouquet",
        colors: [
            "purple",
            "pink",
            "blue",
            "yellow"
        ],
        price: 199
    },

    "buldak": {
        name: "Buldak Bouquet",
        description:
            "A unique Buldak bouquet perfect for gifting.",
        folder: "buldak",
        colors: [],
        price: 1100
    },

    "chocolate-bouquet": {
        name: "Chocolate Bouquet",
        description:
            "A sweet chocolate bouquet perfect for special occasions.",
        folder: "chocolate-bouquet",
        colors: [],
        price: 699
    },

    "money-bouquet": {
        name: "Money Bouquet",
        description:
            "A creative money bouquet perfect for birthdays and special celebrations.",
        folder: "money-bouquet",
        colors: [],
        price: 399
    },


    /* =========================
       BOX / BAG
    ========================= */

    "blossom-bag": {
        name: "Blossom Bag",
        description:
            "A beautiful floral arrangement presented in a stylish bag.",
        folder: "blossom-bag",
        colors: [],
        price: 155
    },

    "blossom-box": {
        name: "Blossom Box",
        description:
            "A beautiful blossom box with lights and a mini photo strip.",
        folder: "blossom-box",
        colors: [],
        price: 219
    },

    "chocolate-box": {
        name: "Chocolate Box",
        description:
            "A sweet chocolate gift box perfect for special occasions.",
        folder: "chocolate-box",
        colors: [],
        price: "Out of stock"
    },


    /* =========================
       RINGS / JEWELRY
    ========================= */

    "white-ring": {
        name: "White Ring",
        description:
            "A simple and elegant ring perfect as a meaningful gift.",
        folder: "white-ring",
        colors: [],
        price: 100
    },

    "pink-ring": {
        name: "Pink Ring",
        description:
            "A lovely pink ring perfect for special occasions.",
        folder: "pink-ring",
        colors: [],
        price: 110
    },

    "couple-ring": {
        name: "Couple Ring",
        description:
            "A matching couple ring set perfect as a meaningful gift.",
        folder: "couple-ring",
        colors: [],
        price: 180
    },

    "necklace": {
        name: "Necklace",
        description:
            "A beautiful necklace perfect for gifting.",
        folder: "necklace",
        colors: [],
        price: 180
    },


    /* =========================
       KEYCHAINS / ACCESSORIES
    ========================= */

    "drive-safe": {
        name: "Drive Safe",
        description:
            "A thoughtful Drive Safe gift item perfect for someone special.",
        folder: "drive-safe",
        colors: [],
        price: 50
    },

    "regular-keychain": {
        name: "Regular Keychain",
        description:
            "A customizable regular keychain perfect for gifting.",
        folder: "regular-keychain",
        colors: [],
        price: 40
    },

    "spotify-keychain": {
        name: "Spotify Keychain",
        description:
            "A personalized Spotify keychain made for meaningful memories.",
        folder: "spotify-keychain",
        colors: [],
        price: 55
    },

    "mini-cd": {
        name: "Mini CD",
        description:
            "A cute personalized mini CD keepsake.",
        folder: "mini-cd",
        colors: [],
        price: 149
    },

    "ref-magnet": {
        name: "Ref Magnet",
        description:
            "A personalized refrigerator magnet perfect as a small keepsake.",
        folder: "ref-magnet",
        colors: [],
        price: "Price varies"
    },

    "phone-lanyard": {
        name: "Phone Lanyard",
        description:
            "A customizable phone lanyard perfect for everyday use.",
        folder: "phone-lanyard",
        colors: [],
        price: "Out of stock"
    },

    "button-pin": {
        name: "Button Pin",
        description:
            "A customizable button pin perfect for gifts and personal collections.",
        folder: "button-pin",
        colors: [],
        price: 40
    },

    "pocket-mirror": {
        name: "Pocket Mirror",
        description:
            "A cute customizable pocket mirror perfect for gifting.",
        folder: "pocket-mirror",
        colors: [],
        price: 50
    },


    /* =========================
       PHOTO PRODUCTS
    ========================= */

    "polaroid": {
        name: "Polaroid",
        description:
            "A personalized polaroid photo keepsake.",
        folder: "polaroid",
        colors: [],
        price: 6
    },

    "mini-photo-strip": {
        name: "Mini Photo Strip",
        description:
            "A personalized mini photo strip keepsake.",
        folder: "mini-photo-strip",
        colors: [],
        price: 25
    },

    "regular-photo-strip": {
        name: "Regular Photo Strip",
        description:
            "A personalized regular photo strip keepsake.",
        folder: "regular-photo-strip",
        colors: [],
        price: 55
    },


    /* =========================
       OTHER PRODUCTS
    ========================= */

    "makeup-bouquet": {
        name: "Makeup Bouquet",
        description:
            "A creative bouquet made with makeup items, perfect as a special gift.",
        folder: "makeup-bouquet",
        colors: [],
        price: "Custom Price"
    },

    "beverage-bouquet": {
        name: "Beverage Bouquet",
        description:
            "A unique beverage bouquet perfect for celebrations and gifting.",
        folder: "beverage-bouquet",
        colors: [],
        price: "Custom Price"
    },

    "money-garland": {
        name: "Money Garland",
        description:
            "A creative money garland perfect for birthdays and special celebrations.",
        folder: "money-garland",
        colors: [],
        price: "Custom Price"
    },

    "lei-garland": {
        name: "Lei Garland",
        description:
            "A beautiful lei garland perfect for celebrations and special occasions.",
        folder: "lei-garland",
        colors: [],
        price: "Custom Price"
    },

    "custom-bouquet": {
        name: "Custom Bouquet",
        description:
            "A customizable bouquet made especially for your preferred design.",
        folder: "custom-bouquet",
        colors: [],
        price: "Custom Price"
    }

};


/* =========================================================
   GET PRODUCT ID FROM URL
   ========================================================= */

const params =
    new URLSearchParams(window.location.search);

const productId =
    params.get("id");

const product =
    products[productId];


/* =========================================================
   GET HTML ELEMENTS
   ========================================================= */

const productName =
    document.getElementById("productName");

const productDescription =
    document.getElementById("productDescription");

const productImage =
    document.getElementById("productImage");

const productPrice =
    document.getElementById("productPrice");

const colorGroup =
    document.getElementById("colorGroup");

const colorOptions =
    document.getElementById("colorOptions");

const quantityElement =
    document.getElementById("quantity");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");

const inquireButton =
    document.getElementById("inquireButton");

const mainActionButton =
    document.getElementById("mainActionButton");

const handmadeButton =
    document.getElementById("handmadeButton");

const customizableButton =
    document.getElementById("customizableButton");


/* =========================================================
   VARIABLES
   ========================================================= */

let quantity = 1;

let selectedColor = null;


/* =========================================================
   CHECK PRODUCT
   ========================================================= */

if (product) {

    initializeProduct();

} else {

    productName.textContent =
        "Product Not Found";

    productDescription.textContent =
        "The product you are looking for does not exist.";

    productPrice.textContent =
        "Price unavailable";

    colorGroup.style.display =
        "none";

    productImage.style.display =
        "none";
}


/* =========================================================
   INITIALIZE PRODUCT
   ========================================================= */

function initializeProduct() {

    /* PRODUCT NAME */

    productName.textContent =
        product.name;


    /* DESCRIPTION */

    productDescription.textContent =
        product.description;


    /* PRICE */

    if (typeof product.price === "number") {

        productPrice.textContent =
            `₱${product.price.toLocaleString()}`;

    } else {

        productPrice.textContent =
            product.price;
    }


    /* DEFAULT COLOR */

    if (
        product.colors &&
        product.colors.length > 0
    ) {

        selectedColor =
            product.colors[0];

    } else {

        selectedColor = null;
    }


    /* CREATE COLOR CIRCLES */

    createColorOptions();


    /* UPDATE IMAGE */

    updateProductImage();
}


/* =========================================================
   COLOR OPTIONS
   ========================================================= */

function createColorOptions() {

    colorOptions.innerHTML = "";


    /* NO COLORS */

    if (
        !product.colors ||
        product.colors.length === 0
    ) {

        colorGroup.style.display =
            "none";

        return;
    }


    colorGroup.style.display =
        "block";


    /* COLOR MAP */

    const colorMap = {

        "light-red": "#e88b94",

        "red": "#c65859",

        "blue": "#78a9d3",

        "purple": "#8d63bd",

        "pink": "#e89aa8",

        "violet": "#a979c9",

        "white": "#f5f5f5",

        "yellow": "#f0d24d"

    };


    /* CREATE CIRCLES */

    product.colors.forEach(
        (color, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "color-circle";


            button.dataset.color =
                color;


            button.style.backgroundColor =
                colorMap[color] ||
                "#d8d1d2";


            button.setAttribute(
                "aria-label",
                color
            );


            /* FIRST COLOR */

            if (index === 0) {

                button.classList.add(
                    "selected"
                );
            }


            /* COLOR CLICK */

            button.addEventListener(
                "click",
                function () {

                    selectedColor =
                        this.dataset.color;


                    document
                        .querySelectorAll(
                            ".color-circle"
                        )
                        .forEach(
                            circle => {

                                circle.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    this.classList.add(
                        "selected"
                    );


                    updateProductImage();

                }
            );


            colorOptions.appendChild(
                button
            );

        }
    );
}


/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

function updateProductImage() {

    if (!product) {
        return;
    }


    let imagePath;


    /* PRODUCT WITH COLORS */

    if (selectedColor) {

        imagePath =
            `images/${product.folder}/${selectedColor}.jpg`;

    }


    /* PRODUCT WITHOUT COLORS */

    else {

        imagePath =
            `images/${product.folder}/default.jpg`;
    }


    productImage.src =
        imagePath;


    productImage.alt =
        product.name;


    /* FALLBACK */

    productImage.onerror =
        function () {

            const fallback =
                `images/${product.folder}/default.jpg`;


            if (
                this.src.indexOf(
                    fallback
                ) === -1
            ) {

                this.src =
                    fallback;
            }

        };
}


/* =========================================================
   QUANTITY - PLUS
   ========================================================= */

if (increaseQuantity) {

    increaseQuantity.addEventListener(
        "click",
        function () {

            quantity++;

            quantityElement.textContent =
                quantity;

        }
    );

}


/* =========================================================
   QUANTITY - MINUS
   ========================================================= */

if (decreaseQuantity) {

    decreaseQuantity.addEventListener(
        "click",
        function () {

            if (quantity <= 1) {
                return;
            }

            quantity--;

            quantityElement.textContent =
                quantity;

        }
    );

}


/* =========================================================
   INQUIRE
   ========================================================= */

if (inquireButton) {

    inquireButton.addEventListener(
        "click",
        function () {

            if (!product) {
                return;
            }

            window.location.href =
                `inquiries.html?id=${productId}`;

        }
    );

}


/* =========================================================
   ORDER
   ========================================================= */

if (mainActionButton) {

    mainActionButton.addEventListener(
        "click",
        function () {

            if (!product) {
                return;
            }

            window.location.href =
                `order.html?id=${productId}`;

        }
    );

}


/* =========================================================
   HANDMADE & CUSTOMIZABLE
   ========================================================= */

if (handmadeButton && customizableButton) {

    // Handmade
    handmadeButton.addEventListener("click", function () {

        handmadeButton.classList.add("active");
        customizableButton.classList.remove("active");

    });

    // Customizable
    customizableButton.addEventListener("click", function () {

        customizableButton.classList.add("active");
        handmadeButton.classList.remove("active");

    });

}
