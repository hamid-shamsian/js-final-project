import User from "../services/userService.js";
import { navigateTo } from "../router.js";
import { getBrands } from "../services/brandService.js";
import { getShoes } from "../services/shoeService.js";
import { animateOnFocusBlur } from "../utils/utilityFuncs.js";
import { state } from "../../index.js";

export async function init() {
  const { fullName, avatarURL } = User.get();
  document.getElementById("user-fullname").textContent = fullName;
  document.getElementById("user-avatar").src = avatarURL;

  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo));

  const searchInput = document.querySelector("input[type='search']");
  animateOnFocusBlur(searchInput);

  const brands = await getBrands();
  brands.forEach(renderBrandIcon);
  brands.unshift({ title: "All", id: 0 });
  brands.forEach(renderBrandfilter);

  document.getElementById("brands-filter").addEventListener("click", filterByBrand);

  getAndRenderShoes();
}

function renderBrandIcon({ title, slug }) {
  document.getElementById("brands-container").insertAdjacentHTML(
    "beforeend",
    `<a href="/brand?${slug}" class="flex flex-col items-center gap-3">
      <div class="w-16 h-16 rounded-full bg-gray-200 flex justify-center items-center">
        <img src="../images/${slug}.png" alt="${title}" />
      </div>
      <span class="font-bold text-center w-5/6 overflow-hidden whitespace-nowrap overflow-ellipsis">
        ${title}
      </span>
    </a>`
  );
}

function renderBrandfilter({ title, id }) {
  document.getElementById("brands-filter").insertAdjacentHTML(
    "beforeend",
    `<span class="px-5 py-2 border-2 border-black rounded-full whitespace-nowrap transition-colors duration-300 ${
      id == state.filteringBrandId ? "active-filter" : ""
    }" data-id="${id}">
      ${title}
    </span>`
  );
}

async function getAndRenderShoes() {
  document.getElementById("shoes-container").innerHTML = "";
  const shoes = await getShoes(state.filteringBrandId, true, 5);
  shoes.forEach(renderShoeCard);
}

function renderShoeCard({ title, id, images: [image], price }) {
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

function filterByBrand(e) {
  if (!e.target.id && state.filteringBrandId != e.target.dataset.id) {
    e.currentTarget.querySelector(`span[data-id="${state.filteringBrandId}"]`).classList.remove("active-filter");
    state.filteringBrandId = +e.target.dataset.id;
    e.target.classList.add("active-filter");
    getAndRenderShoes();
  }
}
