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

export function renderShoeCard({ title, id, images: [image], price }) {
  document.getElementById("shoes-container").insertAdjacentHTML(
    "beforeend",
    `<article data-id="${id}">
      <div class="product-card__img flex justify-center items-center rounded-3xl bg-gray-100">
        <img src="${image}" alt="product image" />
      </div>
      <h3 class="font-bold text-xl mt-2 overflow-hidden whitespace-nowrap overflow-ellipsis">${title}</h3>
      <span class="font-semibold">$ ${price}</span>
    </article>`
  );
}
