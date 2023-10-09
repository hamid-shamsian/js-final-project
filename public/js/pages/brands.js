import { navigateTo } from "../router.js";
import { getBrandOfSlug } from "../services/brandService.js";
import { renderShoeCard } from "../services/domService.js";
import { getShoes } from "../services/shoeService.js";
import { getQueryParam } from "../utils/utilityFuncs.js";

export async function init() {
  document.getElementById("back").addEventListener("click", () => history.back());

  const brandSlug = getQueryParam();

  try {
    const [{ id, title }] = await getBrandOfSlug(brandSlug);

    document.title += " | " + title;
    document.querySelector("h1").textContent = title;

    const shoesOfBrand = await getShoes(id);

    shoesOfBrand.forEach(renderShoeCard);
  } catch (err) {
    navigateTo(404);
  }
}
