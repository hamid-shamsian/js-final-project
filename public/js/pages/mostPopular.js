import { navigateTo } from "../router.js";
import { getBrandOfSlug, getBrands } from "../services/brandService.js";
import { getShoes } from "../services/shoeService.js";
import { renderShoeCard } from "../services/domService.js";
import { getQueryParam, setQueryParam } from "../utils/utilityFuncs.js";
import { state } from "../../index.js";

export const init = async () => {
  document.getElementById("back").addEventListener("click", () => history.back());

  const brands = await getBrands();

  const filterQueryParam = getQueryParam("filter");
  if (filterQueryParam) {
    try {
      const [{ id }] = await getBrandOfSlug(filterQueryParam);
      state.filteringBrandId = id;
    } catch (err) {
      return navigateTo(404);
    }
  } else if (state.filteringBrandId != 0) {
    setQueryParam("filter", brands.find(b => b.id == state.filteringBrandId).slug);
  }

  brands.unshift({ title: "All", id: 0, slug: "" });
  brands.forEach(renderBrandfilter);

  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo)); // cant use event delegation here because the a tags have another children :(

  document.getElementById("brands-filter").addEventListener("click", filterByBrand);

  getAndRenderShoes();
};

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
  const shoes = await getShoes(state.filteringBrandId, true);
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
