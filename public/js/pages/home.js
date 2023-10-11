import User from "../services/userService.js";
import { navigateTo } from "../router.js";
import { getBrandOfSlug, getBrands } from "../services/brandService.js";
import { getShoes, searchInShoes } from "../services/shoeService.js";
import { animateOnFocusBlur, renderBrandIcon, renderBrandfilter, renderShoeCard, renderSearchResultItem } from "../services/domService.js";
import { getQueryParam, setQueryParam } from "../utils/utilityFuncs.js";
import { debounce } from "../utils/utilityFuncs.js";
import { state } from "../../index.js";

export const init = async () => {
  const { fullName, avatarURL } = User.get();
  document.getElementById("user-fullname").textContent = fullName;
  document.getElementById("user-avatar").src = avatarURL;

  document.getElementById("greetings").textContent = sayGreetings();

  const searchInput = document.querySelector("input[type='search']");
  animateOnFocusBlur(searchInput);
  searchInput.addEventListener("input", startSearch);

  const filterQueryParam = getQueryParam("filter");
  if (filterQueryParam) {
    try {
      const [{ id }] = await getBrandOfSlug(filterQueryParam);
      state.filteringBrandId = id;
    } catch (err) {
      return navigateTo(404);
    }
  }

  const brands = await getBrands();
  brands.forEach(renderBrandIcon);
  brands.unshift({ title: "All", id: 0, slug: "" });
  brands.forEach(item => renderBrandfilter(item, state.filteringBrandId));

  document.getElementById("brands-filter").addEventListener("click", filterByBrand);

  await getAndRenderShoes();

  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo)); // cant use event delegation here because the a tags have another children :(
  document.getElementById("result-box").addEventListener("click", handleClickOnSearchResults);
};

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

const debouncedGetAndRenderSearchResults = debounce(getAndRenderSearchResults);

function startSearch({ target: { value }, inputType }) {
  const resultBox = document.getElementById("result-box");
  if (value.length == 1 && inputType == "insertText") {
    resultBox.className = "line";
    setTimeout(() => (resultBox.className = "open"), 300);
  } else if (!value.length) {
    resultBox.innerHTML = "";
    resultBox.className = "invisible";
  } else {
    resultBox.innerHTML = `
    <div class="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
      <img src="images/spinner.svg" alt="spinner" />
    </div>`;

    debouncedGetAndRenderSearchResults(value);
  }
}

async function getAndRenderSearchResults(query) {
  const results = await searchInShoes(query, 5);
  const resultBox = document.getElementById("result-box");
  resultBox.innerHTML = "";

  if (results.length) {
    results.forEach(renderSearchResultItem);
    resultBox.innerHTML += "<p class='text-center text-xl mt-6 font-bold text-gray-700'>See more...</p>";
  } else resultBox.innerHTML = "<p class='text-center text-xl mt-24 font-bold text-gray-700'>No Results Found...</p>";
}

function handleClickOnSearchResults({ target }) {
  const href = target.parentElement.dataset.href ?? target.dataset.href;
  navigateTo(href);
}
