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
// ------------------------------------------------------------------------------------------------------------------------

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
// ------------------------------------------------------------------------------------------------------------------------

export function renderShoeDetails(shoe) {
  document.getElementById("images").innerHTML = shoe.images
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
  slider.parentElement.dataset.totalSlides = shoe.images.length;

  for (let i = shoe.images.length - 1; i > -1; i--)
    slider.insertAdjacentHTML("afterbegin", `<div class="${i ? "w-2" : "w-7"} h-2 bg-gray-400 rounded-full"></div>`);

  document.querySelector("h1").textContent = shoe.title;

  document.getElementById("sold").textContent = shoe.soldOut;
  document.getElementById("ratings").textContent = shoe.ratings;
  document.getElementById("reviews").textContent = `(${shoe.reviews} reviews)`;
  document.getElementById("description").textContent = shoe.description;

  document.getElementById("sizes").innerHTML = shoe.sizes
    .map(
      (size, i) =>
        `<span class="flex justify-center items-center border-2 border-black rounded-full w-10 h-10 font-bold text-lg ${
          i ? "" : "active-filter"
        }" data-size="${size}">${size}</span>`
    )
    .join("");

  document.getElementById("colors").innerHTML = shoe.colors
    .map(
      (color, i) =>
        `<span class="flex justify-center items-center rounded-full w-10 h-10 flex-shrink-0" style="background-color:${color}" data-color="${color}">${
          i ? "" : '<i class="fa fa-check fa-xl text-white"></i>'
        }</span>`
    )
    .join("");

  document.getElementById("qty").dataset.max = shoe.inStock;

  document.getElementById("unit-price").textContent = "$" + shoe.price;
  document.getElementById("total-price").textContent = "$" + shoe.price;
}
// ------------------------------------------------------------------------------------------------------------------------

export function nextImage() {
  if (this.parentElement.dataset.slide < this.parentElement.dataset.totalSlides) {
    const leftIMG = document.querySelector(`#images div:nth-child(${this.parentElement.dataset.slide})`);
    const rightIMG = document.querySelector(`#images div:nth-child(${++this.parentElement.dataset.slide})`); // this will select next slide and also increases dataset.slide by one :)
    const sliderDot = document.getElementById("slider-dot");

    leftIMG.style.left = "-100%";
    leftIMG.style.right = "100%";
    rightIMG.style.left = 0;
    rightIMG.style.right = 0;

    sliderDot.parentElement.children[this.parentElement.dataset.slide - 2].style.width = "8px";
    sliderDot.parentElement.children[this.parentElement.dataset.slide - 1].style.width = "28px";
    sliderDot.style.width = "44px";
    setTimeout(() => {
      sliderDot.style.left = `${16 * (this.parentElement.dataset.slide - 1)}px`;
      sliderDot.style.width = "28px";
    }, 250);
  }
}
// ------------------------------------------------------------------------------------------------------------------------

export function prevImage() {
  if (this.parentElement.dataset.slide > 1) {
    const rightIMG = document.querySelector(`#images div:nth-child(${this.parentElement.dataset.slide})`);
    const leftIMG = document.querySelector(`#images div:nth-child(${--this.parentElement.dataset.slide})`);
    const sliderDot = document.getElementById("slider-dot");

    leftIMG.style.left = 0;
    leftIMG.style.right = 0;
    rightIMG.style.left = "100%";
    rightIMG.style.right = "-100%";

    sliderDot.parentElement.children[this.parentElement.dataset.slide - 1].style.width = "28px";
    sliderDot.parentElement.children[this.parentElement.dataset.slide].style.width = "8px";
    sliderDot.style.width = "44px";
    sliderDot.style.left = `${16 * (this.parentElement.dataset.slide - 1)}px`;
    setTimeout(() => {
      sliderDot.style.width = "28px";
    }, 250);
  }
}
