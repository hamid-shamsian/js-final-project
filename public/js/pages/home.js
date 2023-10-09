import User from "../services/userService.js";
import { navigateTo } from "../router.js";
import { getBrands } from "../services/brandService.js";
import { getShoes } from "../services/shoeService.js";
import { animateOnFocusBlur, renderShoeCard } from "../services/domService.js";
import { setQueryParam } from "../utils/utilityFuncs.js";
import { state } from "../../index.js";

export const init = async () => {
  const { fullName, avatarURL } = User.get();
  document.getElementById("user-fullname").textContent = fullName;
  document.getElementById("user-avatar").src = avatarURL;

  document.getElementById("greetings").textContent = sayGreetings();

  const searchInput = document.querySelector("input[type='search']");
  animateOnFocusBlur(searchInput);

  const brands = await getBrands();
  brands.forEach(renderBrandIcon);
  brands.unshift({ title: "All", id: 0, slug: "" });
  brands.forEach(renderBrandfilter);

  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo)); // cant use event delegation here because the a tags have another children :(

  document.getElementById("brands-filter").addEventListener("click", filterByBrand);

  getAndRenderShoes();
};

function renderBrandIcon({ title, slug }) {
  document.getElementById("brands-container").insertAdjacentHTML(
    "beforeend",
    `<a href="/brands?${slug}" class="flex flex-col items-center gap-3">
      <div class="w-16 h-16 rounded-full bg-gray-200 flex justify-center items-center">
        <img src="../images/${slug}.png" alt="${title}" />
      </div>
      <span class="font-bold text-center w-5/6 overflow-hidden whitespace-nowrap overflow-ellipsis">
        ${title}
      </span>
    </a>`
  );
}

function renderBrandfilter({ title, id, slug }) {
  document.getElementById("brands-filter").insertAdjacentHTML(
    "beforeend",
    `<span class="px-5 py-2 border-2 border-black rounded-full whitespace-nowrap transition-colors duration-300 ${
      id == state.filteringBrandId ? "active-filter" : ""
    }" data-id="${id}" data-slug="${slug}">
      ${title}
    </span>`
  );
}

async function getAndRenderShoes() {
  document.getElementById("shoes-container").innerHTML = "";
  const shoes = await getShoes(state.filteringBrandId, true, 5);
  shoes.forEach(renderShoeCard);
}

function filterByBrand(e) {
  //  👇 if e.target.id is truthy, it means the container element is clicked.
  if (!e.target.id && state.filteringBrandId != e.target.dataset.id) {
    e.currentTarget.querySelector(`span[data-id="${state.filteringBrandId}"]`).classList.remove("active-filter");
    state.filteringBrandId = +e.target.dataset.id;
    e.target.classList.add("active-filter");
    setQueryParam("filter", e.target.dataset.slug);
    getAndRenderShoes();
  }
}

function sayGreetings() {
  const hour = new Date().getHours();
  if (hour < 4) return "Good Night 🌌";
  if (hour < 12) return "Good Morning 🌄";
  if (hour < 15) return "Good Afternoon 🕑";
  if (hour < 20) return "Good Evening 🌆";
  return "Good Night 🌌";
}
