/* DOM */
// Items
const itemsImage = document.querySelectorAll(".main-item-image");
const addCartBtns = document.querySelectorAll(".add-cart-btn");
const amountCartWrappers = document.querySelectorAll(".amount-cart-wrapper");
const decrementBtns = document.querySelectorAll(".decrement-cart-btn");
const incrementBtns = document.querySelectorAll(".increment-cart-btn");
const amountCartNumbers = document.querySelectorAll(".amount-cart-p");

const itemsCategory = document.querySelectorAll(".item-category");
const itemsName = document.querySelectorAll(".item-name");
const itemsPrice = document.querySelectorAll(".item-price");

const cartStorage = document.querySelector(".cart-storage");
const cartTotalAmount = document.querySelector(".cart-total-amount");
const cartTotalPrice = document.querySelector(".total-price");
const cartList = document.querySelector(".selected-list");
let cartItems = document.querySelectorAll(".selected-item");
const confirmBtn = document.getElementById("confirm-btn");

const confirmedScreen = document.querySelector(".confirmed-screen");
const confirmedList = document.querySelector(".confirmed-list");
const confirmedTotalPrice = document.querySelector(".confirmed-total-price");
const newOrderBtn = document.getElementById("new-order-btn");

/* Saved Values */
let itemsAmountArr = new Array(9).fill(0);
let itemsPricesArr = new Array(9);
let itemsTotalPricesArr = new Array(9).fill(0);

let totalAmount = 0;
let totalPrice = 0;

let thumbnails = new Array(9);
let confirmArr = new Array(9)
  .fill(null)
  .map((_, index) => ({ index, value: false }));

itemsImage.forEach((item, index) => {
  confirmArr[index].index = index;
});

/* Initial statements */
cartTotalAmount.textContent = `(${totalAmount})`;

cartStorage.classList.add("empty");

const darkScreen = document.createElement("div");
darkScreen.className = "dark-screen";
document.body.appendChild(darkScreen);

/* function for fetching data  */
function fetchData() {
  fetch("data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      updateDOM(data);

      itemsPricesArr = data.map((item) => item.price);
      thumbnails = data.map((item) => item.image.thumbnail);
    });
}
fetchData();

// function for updating the DOM
function updateDOM(data) {
  itemsCategory.forEach((category, index) => {
    category.textContent = data[index].category;
  });
  itemsName.forEach((name, index) => {
    name.textContent = data[index].name;
  });
  itemsPrice.forEach((price, index) => {
    price.textContent = "$" + Number(data[index].price).toFixed(2);
  });

  renderItemsImage(data);
  window.addEventListener("resize", () => {
    renderItemsImage(data);
  });
}

// function for rendering images for each screen resized
function renderItemsImage(data) {
  let width = window.innerWidth;
  let device = width >= 1024 ? "desktop" : width >= 600 ? "tablet" : "mobile";

  itemsImage.forEach((image, index) => {
    image.style.backgroundImage = `url(${data[index].image[device]})`;
  });
}

// function for updating the cart's screen
function updateCartScreen() {
  if (totalAmount > 0 && !cartStorage.classList.contains("selected")) {
    cartStorage.classList.remove("empty");
    cartStorage.classList.add("selected");
  }
  if (totalAmount <= 0) {
    cartStorage.classList.remove("selected");
    cartStorage.classList.add("empty");
  }
}

// function for updating amounts and values
function updateTotalValues(operation, index) {
  if (operation === "+") {
    itemsAmountArr[index]++;
    totalAmount++;

    itemsTotalPricesArr[index] = itemsAmountArr[index] * itemsPricesArr[index];
    totalPrice += itemsPricesArr[index];
  } else if (operation === "-") {
    itemsAmountArr[index]--;
    totalAmount--;

    itemsTotalPricesArr[index] = itemsAmountArr[index] * itemsPricesArr[index];
    totalPrice -= itemsPricesArr[index];
  }

  amountCartNumbers[index].textContent = itemsAmountArr[index];

  cartTotalAmount.textContent = `(${totalAmount})`;
  cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;

  updateCartItems(index);
}

// listener for add to cart buttons
addCartBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    itemsImage[index].classList.add("selected");

    btn.style.display = "none";
    amountCartWrappers[index].style.display = "flex";

    confirmArr[index].value = true;

    updateTotalValues("+", index);
    updateCartScreen();
    toggleCartListItems("add", index);
  });
});

// listener for increment buttons
incrementBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    updateTotalValues("+", index);
  });
});

// listener for decrement buttons
decrementBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    updateTotalValues("-", index);

    if (itemsAmountArr[index] <= 0) {
      addCartBtns[index].style.display = "flex";
      amountCartWrappers[index].style.display = "none";
      amountCartNumbers[index].textContent = "";

      itemsImage[index].classList.remove("selected");

      confirmArr[index].value = false;

      toggleCartListItems("remove", index);
    }

    updateCartScreen();
  });
});

// function for adding/removing items from cart's list
function toggleCartListItems(method, index) {
  cartItems = document.querySelectorAll(".selected-item");

  if (method === "add") {
    // Check if item already exists in the cart
    let existingCartItem = [...cartItems].find(
      (item) => item.dataset.index == index
    );

    if (!existingCartItem) {
      // Create a new cart item
      const cartItem = document.createElement("li");
      cartItem.className = "selected-item";
      cartItem.setAttribute("data-index", index); // Store the index for easy retrieval

      const cartItemDetails = document.createElement("div");
      cartItemDetails.className = "selected-item-details";

      const cartItemName = document.createElement("p");
      cartItemName.className = "selected-item-name";
      cartItemName.textContent = itemsName[index].textContent;

      const cartItemNumericDetails = document.createElement("div");
      cartItemNumericDetails.className = "selected-item-numeric-details";

      const cartItemAmount = document.createElement("span");
      cartItemAmount.className = "selected-item-amount";
      cartItemAmount.textContent = `${itemsAmountArr[index]}x`;

      const cartItemPrice = document.createElement("span");
      cartItemPrice.className = "selected-item-price";
      cartItemPrice.textContent = `@$${itemsPricesArr[index].toFixed(2)}`;

      const cartItemTotalPrice = document.createElement("span");
      cartItemTotalPrice.className = "selected-item-total-price";
      cartItemTotalPrice.textContent = `$${itemsTotalPricesArr[index].toFixed(
        2
      )}`;

      const cartItemBtn = document.createElement("button");
      cartItemBtn.className = "selected-item-btn";
      cartItemBtn.addEventListener("click", () => {
        confirmArr[index].value = false;

        toggleCartListItems("remove", index);
      });

      // Create the SVG for the remove button
      const cartItemSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      cartItemSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      cartItemSvg.setAttribute("width", "10");
      cartItemSvg.setAttribute("height", "10");
      cartItemSvg.setAttribute("fill", "none");
      cartItemSvg.setAttribute("viewBox", "0 0 10 10");

      const cartItemPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      cartItemPath.setAttribute("class", "selected-item-btn-img");
      cartItemPath.setAttribute("fill", "#CAAFA7");
      cartItemPath.setAttribute(
        "d",
        "M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
      );

      // Append SVG elements to the button
      cartItemSvg.appendChild(cartItemPath);
      cartItemBtn.appendChild(cartItemSvg);

      // Append elements to the cart item
      cartItem.appendChild(cartItemDetails);
      cartItem.appendChild(cartItemBtn);
      cartItemDetails.appendChild(cartItemName);
      cartItemDetails.appendChild(cartItemNumericDetails);
      cartItemNumericDetails.appendChild(cartItemAmount);
      cartItemNumericDetails.appendChild(cartItemPrice);
      cartItemNumericDetails.appendChild(cartItemTotalPrice);

      // Append the new cart item to the cart list
      cartList.appendChild(cartItem);
    } else {
      // If the item already exists, just update the values
      updateCartItems(index);
    }
  } else if (method === "remove") {
    // Handle item removal
    let existingCartItem = document.querySelector(
      `.selected-item[data-index="${index}"]`
    );
    if (existingCartItem) {
      // Remove the item from the DOM
      existingCartItem.remove();
      // Update the total values in case the item is removed
      totalAmount -= itemsAmountArr[index];
      totalPrice -= itemsTotalPricesArr[index];
      itemsAmountArr[index] = 0;
      itemsTotalPricesArr[index] = 0;

      // Update the cart totals
      cartTotalAmount.textContent = `(${totalAmount})`;
      cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
      updateCartScreen();

      // Update items
      amountCartWrappers[index].style.display = "none";
      addCartBtns[index].style.display = "flex";
      amountCartNumbers[index].textContent = "";
      itemsImage[index].classList.remove("selected");
    }
  }
}

// function for updating item's values from cart's list
function updateCartItems(index) {
  let existingCartItem = document.querySelector(
    `.selected-item[data-index="${index}"]`
  );

  if (existingCartItem) {
    let cartItemAmount = existingCartItem.querySelector(
      ".selected-item-amount"
    );
    let cartItemPrice = existingCartItem.querySelector(".selected-item-price");
    let cartItemTotalPrice = existingCartItem.querySelector(
      ".selected-item-total-price"
    );

    cartItemAmount.textContent = `${itemsAmountArr[index]}x`;
    cartItemPrice.textContent = `@$${itemsPricesArr[index].toFixed(2)}`;
    cartItemTotalPrice.textContent = `$${itemsTotalPricesArr[index].toFixed(
      2
    )}`;
  }
}

// listener for confirm button
confirmBtn.addEventListener("click", () => {
  createConfirmedItems();
  confirmedScreen.classList.add("active");
  darkScreen.classList.add("active");

  confirmedScreen.scrollIntoView({ behavior: "smooth", block: "center" });
});

// function for creating the confirmed items
function createConfirmedItems() {
  // Clear previous confirmed list
  confirmedList.innerHTML = "";

  // Sort confirmArr by index to maintain original order
  const sortedConfirmArr = confirmArr.slice().sort((a, b) => a.index - b.index);

  sortedConfirmArr.forEach((item) => {
    if (item.value === true) {
      let index = item.index; // Get the actual index

      // Create item DOM elements
      const confirmedItem = document.createElement("li");
      confirmedItem.className = "confirmed-item";

      const confirmedItemContent = document.createElement("section");
      confirmedItemContent.className = "confirmed-item-content";

      const confirmedItemImg = document.createElement("img");
      confirmedItemImg.className = "confirmed-item-img";
      confirmedItemImg.setAttribute("src", thumbnails[index]);

      const confirmedItemDetails = document.createElement("div");
      confirmedItemDetails.className = "confirmed-item-details";

      const confirmedItemName = document.createElement("p");
      confirmedItemName.className = "confirmed-item-name";
      confirmedItemName.textContent = itemsName[index].textContent;

      const confirmedItemNumericDetails = document.createElement("div");
      confirmedItemNumericDetails.className = "confirmed-item-numeric-details";

      const confirmedItemAmount = document.createElement("span");
      confirmedItemAmount.className = "confirmed-item-amount";
      confirmedItemAmount.textContent = itemsAmountArr[index] + "x";

      const confirmedItemPrice = document.createElement("span");
      confirmedItemPrice.className = "confirmed-item-price";
      confirmedItemPrice.textContent = `@$${itemsPricesArr[index].toFixed(2)}`;

      const confirmedItemTotalPrice = document.createElement("p");
      confirmedItemTotalPrice.className = "confirmed-item-total-price";
      confirmedItemTotalPrice.textContent = `$${itemsTotalPricesArr[
        index
      ].toFixed(2)}`;

      // Append elements
      confirmedList.appendChild(confirmedItem);
      confirmedItem.appendChild(confirmedItemContent);
      confirmedItem.appendChild(confirmedItemTotalPrice);
      confirmedItemContent.appendChild(confirmedItemImg);
      confirmedItemContent.appendChild(confirmedItemDetails);
      confirmedItemDetails.appendChild(confirmedItemName);
      confirmedItemDetails.appendChild(confirmedItemNumericDetails);
      confirmedItemNumericDetails.appendChild(confirmedItemAmount);
      confirmedItemNumericDetails.appendChild(confirmedItemPrice);
    }
  });

  // Update total confirmed price
  confirmedTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// Listener for new order button
newOrderBtn.addEventListener("click", () => {
  prepareNewOrder();
});

// Function for preparing a new order
function prepareNewOrder() {
  // Reset selected and confirmed lists
  cartList.innerHTML = "";
  confirmedList.innerHTML = "";

  // Reset item amounts
  itemsAmountArr.fill(0);
  itemsTotalPricesArr.fill(0);
  totalAmount = 0;
  totalPrice = 0;

  // Reset total values in UI
  cartTotalAmount.textContent = `(0)`;
  cartTotalPrice.textContent = `$0.00`;
  confirmedTotalPrice.textContent = `$0.00`;

  // Reset selection indicators and styles
  itemsImage.forEach((image) => image.classList.remove("selected"));
  addCartBtns.forEach((btn) => (btn.style.display = "flex"));
  amountCartWrappers.forEach((wrapper) => (wrapper.style.display = "none"));
  amountCartNumbers.forEach((number) => (number.textContent = ""));

  // Reset confirmArr while keeping structure
  confirmArr.forEach((item) => (item.value = false));

  // Reset cart visibility
  cartStorage.classList.remove("selected");
  cartStorage.classList.add("empty");

  // Hide confirmation screen
  confirmedScreen.classList.remove("active");
  darkScreen.classList.remove("active");
}
