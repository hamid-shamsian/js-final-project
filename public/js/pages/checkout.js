import { navigateTo } from "../router.js";
import { renderAddressItem, renderCartItem } from "../services/domService.js";
import { getShoe } from "../services/shoeService.js";
import User from "../services/userService.js";

const { cart, addresses } = User.get();

export const init = async () => {
  document.getElementById("back").addEventListener("click", e => history.back()); // we cant only use reference to history.back because as always an event object is passed to handler and that way(using only reference) we will get an error.
  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo));

  const address = addresses.find(add => add.active);
  const addressCard = document.getElementById("address");
  addressCard.children[0].textContent = address.title;
  addressCard.children[1].textContent = address.details;

  const products = await Promise.all(cart.map(item => getShoe(item.productId)));

  const richCartItems = cart.map((c, i) => ({
    ...c,
    title: products[i].title,
    image: products[i].images[0]
  }));

  richCartItems.forEach(item => renderCartItem("order-list", item, true));

  document.getElementById("products-price").textContent = "$" + cart.reduce((sum, item) => item.price * item.qty + sum, 0).toFixed(2);
};
