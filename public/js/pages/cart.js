import User from "../services/userService.js";
import { navigateTo } from "../router.js";
import { getShoe } from "./../services/shoeService.js";
import { renderCartItem } from "../services/domService.js";

const cart = User.get().cart;

export const init = async () => {
  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo));

  const products = await Promise.all(cart.map(c => getShoe(c.productId)));

  const cartItems = cart.map((c, i) => ({
    ...c,
    title: products[i].title,
    inStock: products[i].inStock,
    image: products[i].images[0]
  }));

  cartItems.forEach(renderCartItem);

  updateTotalPrice();

  document.getElementById("cart-container").addEventListener("click", doActions);
};

function doActions(e) {
  if (e.target.parentElement.id == "qty") changeQty(e.target);
  else if (e.target.classList.contains("delete")) initDeleteModal;
}

function changeQty(target) {
  if (target.nodeName == "I") {
    const dataset = target.parentElement.dataset;
    const targetCartItem = cart.find(c => c.productId == dataset.id);

    targetCartItem.qty += +target.dataset.step;

    targetCartItem.qty ||= 1;
    targetCartItem.qty > +dataset.max && (targetCartItem.qty = +dataset.max);

    target.parentElement.children[1].textContent = targetCartItem.qty;
    target.parentElement.previousElementSibling.textContent = "$" + (targetCartItem.qty * targetCartItem.price).toFixed(2);
    updateTotalPrice();
  }
}

function updateTotalPrice() {
  const totalPrice = cart.reduce((sum, item) => item.price * item.qty + sum, 0);
  document.getElementById("total-price").textContent = "$" + totalPrice.toFixed(2);
}
