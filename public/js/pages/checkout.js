import { navigateTo } from "../router.js";
import { renderCartItem, renderAddressItem, renderMethodItem, renderMethodCard } from "../services/domService.js";
import { getShoe } from "../services/shoeService.js";
import { getShippingMethods } from "../services/orderService.js";
import User, { saveUserData } from "../services/userService.js";
import { formatPrice } from "../utils/utilityFuncs.js";

const { id: userId, cart, addresses = [] } = User.get(); // cart does not need default (=[]) value because this page is protected against users with no cart item.
let { lastUsedShipMtdId } = User.get(); // "let" is used because unlike above values, this value is primitive and might be changed through this page by user.

let shippingMethods = null;

export const init = async () => {
  document.getElementById("back").addEventListener("click", e => history.back()); // we cant only use reference to history.back because as always an event object is passed to handler and that way(using only reference) we will get an error.
  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo));

  const products = await Promise.all(cart.map(item => getShoe(item.productId)));

  const richCartItems = cart.map((c, i) => ({
    ...c,
    title: products[i].title,
    image: products[i].images[0]
  }));

  richCartItems.forEach(item => renderCartItem("order-list", item, true));

  document.getElementById("products-price").textContent = formatPrice(cart.reduce((sum, item) => item.price * item.qty + sum, 0));

  addresses.forEach((a, i) => renderAddressItem(a, i + 1));

  shippingMethods = await getShippingMethods();
  shippingMethods.forEach(m => renderMethodItem(m, lastUsedShipMtdId));

  updateAddressCard();
  updateMethodData();

  document.getElementById("choose-address").addEventListener("click", () => openModal("address"));
  document.getElementById("apply-address").addEventListener("click", applyAddress);

  document.getElementById("choose-method").addEventListener("click", () => openModal("method"));
  document.getElementById("apply-method").addEventListener("click", applyMethod);

  document.querySelectorAll(".back").forEach(btn => btn.addEventListener("click", closeModal));
};

function updateAddressCard() {
  const { title, details } = addresses.find(a => a.active);
  const addressCard = document.getElementById("address");
  addressCard.children[0].textContent = title;
  addressCard.children[1].textContent = details;
}

function updateMethodData() {
  const shippingMethod = shippingMethods.find(m => m.id == lastUsedShipMtdId);
  renderMethodCard(shippingMethod);
  document.getElementById("shipping-price").textContent = formatPrice(shippingMethod?.price);
  updateTotalPrice();
}

function openModal(modal) {
  toggleOverlay();
  const modalElem = document.getElementById(`${modal}-modal`);
  setTimeout(() => {
    modalElem.style.left = 0;
    modalElem.style.right = 0;
  }, 0);
}

function closeModal() {
  const modalElem1 = document.getElementById(`address-modal`);
  const modalElem2 = document.getElementById(`method-modal`);
  modalElem1.style.left = "";
  modalElem1.style.right = "";
  modalElem2.style.left = "";
  modalElem2.style.right = "";
  setTimeout(toggleOverlay, 500);
}

function toggleOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.classList.toggle("hidden");
}

function applyAddress() {
  const selectedAdrId = document.getElementById("address-items")["address"].value;
  addresses.find(a => a.active).active = false;
  addresses.find(a => a.id == selectedAdrId).active = true;
  updateAddressCard();
  closeModal();
  saveUserData(userId, { addresses });
}

function applyMethod() {
  lastUsedShipMtdId = document.getElementById("method-items")["method"].value;
  updateMethodData();
  closeModal();
  saveUserData(userId, { lastUsedShipMtdId });
}

function updateTotalPrice() {
  document.getElementById("total-price").textContent = formatPrice(
    shippingMethods.find(m => m.id == lastUsedShipMtdId).price + cart.reduce((sum, item) => item.price * item.qty + sum, 0)
  );
}
