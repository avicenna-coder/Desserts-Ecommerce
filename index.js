const addToCartButtons = document.querySelectorAll(".add-cart")
const columnContainer = document.querySelector(".column-container")
const cartItemInfo = document.querySelector(".cart-item-info")
const emptyContainer = document.querySelector(".empty-container")
const overlayDisplayCont = document.querySelector(".overlay-container")
const overlayCard = document.querySelector(".overlay-card")
const confirmOrderButton = document.querySelector(".confirm-order-container");

addToCartButtons.forEach((addCart)=>{
    addCart.addEventListener("click", (event)=>{
        const bgImgDescContainer = event.target.closest(".bg-image-description-container")
        transferToCart(bgImgDescContainer)
    })
    
})

const transferToCart = (bgImgDescContainer)=>{
    const cartName = bgImgDescContainer.querySelector(".cart-name")
    const nameofCart = cartName.textContent
    const cartDescription = bgImgDescContainer.querySelector(".cart-description")
    const cartPrice = bgImgDescContainer.querySelector(".cart-price")
    const price = parseFloat(cartPrice.textContent.replace("$", "")).toFixed(2)
    

    const hiddenAddToCart = bgImgDescContainer.querySelectorAll(".hidden-add-to-cart-icons")
    const btnContainerIcon = bgImgDescContainer.querySelectorAll(".btn-container-icon")

    hiddenAddToCart.forEach((hiddenCart)=>{
        hiddenCart.classList.add("show")
    })
    btnContainerIcon.forEach((btnContainer)=>{
        btnContainer.classList.add("remove")
    })

    const orderedCartNames = columnContainer.querySelectorAll(".ordered-cart-name p");

    for (let item of orderedCartNames) {
        if (item.textContent.trim() === nameofCart.trim()) {
            alert(`This item has been added to the cart already.`);
            return;
        }
    }

    const columnOneContainer = document.createElement("div")
    columnOneContainer.classList.add("column-one-container")

    columnOneContainer.innerHTML = `
        <div class="ordered-cart-name">
                            <p>${nameofCart}</p>
                        </div>
                        <div class="description-ordered">
                            <div class="t-ordered-amnt-b-paid">
                                <div class="times-ordered">
                                    <p>1x</p>
                                </div>
                                <div class="amount-to-be-paid">
                                    <p>$${price}</p>
                                    <p>$${price}</p>
                                </div>
                            </div>
                            <div class="cancel-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
                            </div>
                        </div>
    `

    columnContainer.appendChild(columnOneContainer)
    
    
    

    if (cartItemInfo && emptyContainer) {
        cartItemInfo.classList.add("visible");
        emptyContainer.classList.add("hidden")
    }

    const cancelButton = columnOneContainer.querySelector(".cancel-icon");
    cancelButton.addEventListener("click", () => {
    columnOneContainer.remove();
    btnContainerIcon.forEach((btnContainer)=>{
        btnContainer.classList.remove("remove")
    })
    hiddenAddToCart.forEach((hiddenCart)=>{
        hiddenCart.classList.remove("show")
    })
    countCartItem(-1);
    updateTotalPrice();
    
});

    hiddenAddToCart.forEach((hiddenItem) => {
        const decrementBtn = hiddenItem.querySelector(".decrement");
        const numberElement = hiddenItem.querySelector("p");
        const incrementBtn = hiddenItem.querySelector(".increment");        
    
        // Find the corresponding .times-ordered p element for this item
        const timesOrdered = columnOneContainer.querySelector(".times-ordered p");
        const counCart = columnContainer.querySelector(".count-cart")


    
        decrementBtn.addEventListener("click", () => {
            let quantity = parseInt(numberElement.textContent, 10);
            if (quantity > 1) {
                quantity--;
                numberElement.textContent = quantity;
                timesOrdered.textContent = `${quantity}x`;
                counCart.textContent = `${quantity}`
            }
            updateTotalPrice();
        });
    
        incrementBtn.addEventListener("click", () => {
            let quantity = parseInt(numberElement.textContent, 10);
            quantity++;
            numberElement.textContent = quantity;
            timesOrdered.textContent = `${quantity}x`;
            updateTotalPrice();            
        });
    });
    countCartItem(1)
    updateTotalPrice();
    
}

const updateTotalPrice = () => {
    let total = 0;
    const totalPrice = document.querySelector(".input-field-container p"); // Ensure this element exists in your HTML
    const cartBoxes = columnContainer.querySelectorAll(".column-one-container");

    cartBoxes.forEach((cartBox) => {
        const priceToBePaid = cartBox.querySelector(".amount-to-be-paid p:nth-child(2)"); // Select the second <p> for the price
        const number = cartBox.querySelector(".times-ordered p");
        const price = parseFloat(priceToBePaid.textContent.replace("$", "")); // Remove "$" and parse as float
        const quantity = parseInt(number.textContent); // Parse quantity as integer
        

        total += price * quantity; // Calculate total
    });

    totalPrice.textContent = `$${total.toFixed(2)}`; // Update the total price display
};

let cartItemCount = 0

const countCartItem = (change) => {
    let yourCartContainer = document.querySelector(".your-cart-container p");
    
    cartItemCount += change;
    if (cartItemCount < 0) cartItemCount = 0; // Prevent negative numbers

    yourCartContainer.textContent = `Your Cart (${cartItemCount})`;

    // If no items left, reset the cart count
    if (cartItemCount === 0) {
        yourCartContainer.textContent = `Your Cart (0)`;
        
    }
};

confirmOrderButton.addEventListener("click", () => {
    
    const cartItems = columnContainer.querySelectorAll(".column-one-container");

    cartItems.forEach((cartItem) => {
        const itemName = cartItem.querySelector(".ordered-cart-name p").textContent.trim();
        const quantity = parseInt(cartItem.querySelector(".times-ordered p").textContent.trim(), 10) || 1;
        const priceElement = cartItem.querySelector(".amount-to-be-paid p:nth-child(2)");
        const price = parseFloat(priceElement.textContent.replace("$", "")) || 0;

        // Find corresponding product for image
        const originalProduct = Array.from(document.querySelectorAll(".bg-image-description-container"))
            .find(product => product.querySelector(".cart-name").textContent.trim() === itemName);
        
            let imageUrl = "";
            if (originalProduct) {
                const imageElement = originalProduct.querySelector("[class^='background-image']");
                if (imageElement) {
                    const computedStyle = window.getComputedStyle(imageElement);
                    imageUrl = computedStyle.backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
                    console.log(imageUrl); // Check if the URL is correct
                }
            }

        const overlayImgTextContainer = document.createElement("div");
        overlayImgTextContainer.classList.add("overlay-img-text-cards");

        overlayImgTextContainer.innerHTML = `
        <div class="overlay-img-text-container">
            <div class="cart-img-container">
                <img src="${imageUrl}" alt="${itemName}">
            </div>
            <div class="cart-name-cart-price-container">
                <div class="cart-name-count-price">
                    <p class="name-cart">${itemName}</p>
                    <div class="cart-count-cart-price">
                        <p class="count-cart">${quantity}x</p>
                        <p>@$${price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-price">
                    <p>$${(price * quantity).toFixed(2)}</p>
                </div>
            </div>
            </div>
        `;

        overlayCard.insertBefore(overlayImgTextContainer, overlayCard.children[2]);
    });

    // Update overlay total price
    const totalPrice = document.querySelector(".input-field-container p")?.textContent || "$0.00";
    overlayCard.querySelector(".input-field-container p").textContent = totalPrice;

    // Ensure overlay is visible
    if (overlayDisplayCont) {
        overlayDisplayCont.style.visibility = "visible";
        overlayDisplayCont.style.opacity = "1";
        overlayDisplayCont.style.display = "block";  // Ensure it's displayed
    } else {
        console.error("Overlay container not found!");
    }

});

const startNewOrder = document.querySelector(".start-new-order button");

startNewOrder.addEventListener("click", () => {
    overlayDisplayCont.style.visibility = "hidden";
    overlayDisplayCont.style.opacity = "0";
    overlayDisplayCont.style.display = "none"; // Ensure it's hidden properly

    alert("Thanks for shopping with us.");

    // Clear cart items in the column container
    columnContainer.innerHTML = "";

    // Clear overlay cart items
    const overlayImgTextContainers = overlayCard.querySelectorAll(".overlay-img-text-cards");
    overlayImgTextContainers.forEach(container => container.remove());

    // Reset total price
    updateTotalPrice();

    // Reset cart count
    cartItemCount = 0;
    countCartItem(0);

    // Reset hidden cart buttons visibility
    const hiddenAddToCart = document.querySelectorAll(".hidden-add-to-cart-icons");
    hiddenAddToCart.forEach(hiddenCart => {
        hiddenCart.classList.remove("show"); // Hide instead of removing
    });

    // Reset visibility of add-to-cart buttons
    const btnContainerIcons = document.querySelectorAll(".btn-container-icon");
    btnContainerIcons.forEach(btn => {
        btn.classList.remove("remove");
    });

    // Reset empty cart message
    if (cartItemInfo && emptyContainer) {
        cartItemInfo.classList.remove("visible");
        emptyContainer.classList.remove("hidden");
    }
});
