export function animateOnFocusBlur(...inputs) {
  inputs.forEach(i => {
    i.addEventListener("focus", function () {
      this.parentElement.classList.add("focused-input");
      this.previousElementSibling.classList.add("fa-lg");
    });
    i.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused-input");
      this.previousElementSibling.classList.remove("fa-lg");
    });
  });
}
// ========================================================================================================================================

export function renderShoeCard({ title, id, images: [image], price }) {
  document.getElementById("shoes-container").insertAdjacentHTML(
    "beforeend",
    `<article>
      <a href="/product?id=${id}">
        <div class="product-card__img flex justify-center items-center rounded-3xl bg-gray-100">
          <img src="${image}" alt="product image" />
        </div>
        <h3 class="font-bold text-xl mt-2 overflow-hidden whitespace-nowrap overflow-ellipsis">${title}</h3>
        <span class="font-semibold">$${price}</span>
      </a>
    </article>`
  );
}
// ========================================================================================================================================

export function renderShoeDetails({ title, images, soldOut, ratings, reviews, description, sizes, colors, inStock, price }) {
  document.getElementById("images").innerHTML = images
    .map(
      (img, i) =>
        `<div class="flex justify-center items-center overflow-hidden transition-all duration-500 absolute w-full h-full ${
          i ? "left-full -right-full" : "left-0 right-0"
        }">
        <img src="${img}" alt="product image" class="w-full" />
      </div>`
    )
    .join("");

  const slider = document.getElementById("slider");
  slider.parentElement.dataset.totalSlides = images.length;

  for (let i = images.length - 1; i > -1; i--)
    slider.insertAdjacentHTML("afterbegin", `<div class="${i ? "w-2" : "w-7"} h-2 bg-gray-400 rounded-full"></div>`);

  document.querySelector("h1").textContent = title;

  document.getElementById("sold").textContent = soldOut;
  document.getElementById("ratings").textContent = ratings;
  document.getElementById("reviews").textContent = `(${reviews} reviews)`;
  document.getElementById("description").textContent = description;

  document.getElementById("sizes").innerHTML = sizes
    .map(
      (size, i) =>
        `<span class="flex justify-center items-center border-2 border-black rounded-full w-10 h-10 font-bold text-lg ${
          i ? "" : "active-filter"
        }" data-size="${size}">${size}</span>`
    )
    .join("");

  document.getElementById("colors").innerHTML = colors
    .map(
      (color, i) =>
        `<span class="flex justify-center items-center rounded-full w-10 h-10 flex-shrink-0" style="background-color:${color}" data-color="${color}">${
          i ? "" : '<i class="fa fa-check fa-xl text-white"></i>'
        }</span>`
    )
    .join("");

  document.getElementById("qty").dataset.max = inStock;

  document.getElementById("unit-price").textContent = "$" + price;
  document.getElementById("total-price").textContent = "$" + price;
}
// ========================================================================================================================================

export function renderCartItem(containerId, { id, title, image, color, size, price, qty, inStock }, staticCard) {
  document.getElementById(containerId).insertAdjacentHTML(
    "beforeend",
    `<article class="flex items-center gap-3 p-5 rounded-3xl bg-white">
      <div class="product-card__img flex-shrink-0 flex justify-center items-center rounded-3xl bg-gray-200 overflow-hidden">
        <img src="${image}" alt="product image" width="110" />
      </div>
      <div class="w-full">
        <div class="flex justify-between items-center">
          <h2 class="font-bold text-xl w-44 overflow-hidden whitespace-nowrap overflow-ellipsis">${id}</h2>
          ${staticCard ? "" : `<img src="./images/bin.png" alt="trash" width="20" class="delete" data-id="${id}"/>`}
        </div>
        <div class="my-3 flex items-center gap-3">
          <span class="flex justify-center items-center rounded-full w-5 h-5 flex-shrink-0" style="background-color:${color}"></span>
          <span>${color}</span>|
          <span>Size:</span>
          <span>${size}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="font-bold text-lg">$${(price * qty).toFixed(2)}</span>
          <div
            ${staticCard ? "" : `id="qty" data-id="${id}" data-max="${inStock}"`}
            class="flex${staticCard ? "" : " w-28"} justify-between items-center px-4 py-1 font-bold text-lg bg-gray-200 rounded-full"
          >
            ${staticCard ? "" : '<i class="fa fa-minus" data-step="-1"></i>'}
            <span>${qty}</span>
            ${staticCard ? "" : '<i class="fa fa-plus" data-step="1"></i>'}
          </div>
        </div>
      </div>
    </article>`
  );
}
// ========================================================================================================================================

export function nextImage() {
  const sliderData = this.parentElement.dataset;

  if (sliderData.slide < sliderData.totalSlides) {
    const leftImg = document.querySelector(`#images div:nth-child(${sliderData.slide})`);
    const rightImg = document.querySelector(`#images div:nth-child(${++sliderData.slide})`); // this will select next slide and also increases dataset.slide by one :)
    const sliderDot = document.getElementById("slider-dot");

    leftImg.style.left = "-100%";
    leftImg.style.right = "100%";
    rightImg.style.left = 0;
    rightImg.style.right = 0;

    const dots = sliderDot.parentElement.children;
    dots[sliderData.slide - 2].style.width = "8px";
    dots[sliderData.slide - 1].style.width = "28px";
    sliderDot.style.width = "44px";
    setTimeout(() => {
      sliderDot.style.left = `${16 * (sliderData.slide - 1)}px`;
      sliderDot.style.width = "28px";
    }, 250);
  }
}
// ========================================================================================================================================

export function prevImage() {
  const sliderData = this.parentElement.dataset;

  if (sliderData.slide > 1) {
    const rightImg = document.querySelector(`#images div:nth-child(${sliderData.slide})`);
    const leftImg = document.querySelector(`#images div:nth-child(${--sliderData.slide})`);
    const sliderDot = document.getElementById("slider-dot");

    leftImg.style.left = 0;
    leftImg.style.right = 0;
    rightImg.style.left = "100%";
    rightImg.style.right = "-100%";

    const dots = sliderDot.parentElement.children;
    dots[sliderData.slide - 1].style.width = "28px";
    dots[sliderData.slide].style.width = "8px";
    sliderDot.style.width = "44px";
    sliderDot.style.left = `${16 * (sliderData.slide - 1)}px`;
    setTimeout(() => {
      sliderDot.style.width = "28px";
    }, 250);
  }
}
