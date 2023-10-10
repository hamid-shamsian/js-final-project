import User, { saveUserData } from "../services/userService.js";
import { navigateTo } from "../router.js";
import { getShoe } from "../services/shoeService.js";
import { renderCartItem } from "../services/domService.js";
import { debounce } from "../utils/utilityFuncs.js";
import showToast from "../utils/toast.js";

const { cart, id: userId } = User.get();
let richCartItems = null;

const debouncedUpdateCart = debounce(saveUserData, 500);
// ==============================================================================================================

export const init = async () => {
  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo));

  const products = await Promise.all(cart.map(item => getShoe(item.productId)));

  richCartItems = cart.map((c, i) => ({
    ...c,
    title: products[i].title,
    inStock: products[i].inStock,
    image: products[i].images[0]
  }));

  richCartItems.forEach(item => renderCartItem("cart-container", item));

  updatePage();

  document.getElementById("cart-container").addEventListener("click", doActions);
  document.getElementById("cancel").addEventListener("click", closeDeleteModal);
  document.getElementById("ok").addEventListener("click", deleteCartItem);
  document.getElementById("checkout").addEventListener("click", () => navigateTo("/checkout"));
};
// ==============================================================================================================

function doActions({ target }) {
  if (target.parentElement.id == "qty") changeQty(target);
  else if (target.classList.contains("delete")) initDeleteModal(target.dataset.id);
}
// ==============================================================================================================

function changeQty({ nodeName, parentElement, dataset }) {
  if (nodeName == "I") {
    const parent_ds = parentElement.dataset;
    const index = cart.findIndex(item => item.id == parent_ds.id);
    const targetCartItem = cart[index];

    targetCartItem.qty += +dataset.step;

    targetCartItem.qty ||= 1;
    targetCartItem.qty > +parent_ds.max && (targetCartItem.qty = +parent_ds.max);

    richCartItems[index].qty = targetCartItem.qty;

    parentElement.children[1].textContent = targetCartItem.qty;
    parentElement.previousElementSibling.textContent = "$" + (targetCartItem.qty * targetCartItem.price).toFixed(2);
    updatePage();

    debouncedUpdateCart(userId, { cart });
  }
}
// ==============================================================================================================

function updatePage() {
  const totalPrice = cart.reduce((sum, item) => item.price * item.qty + sum, 0);
  document.getElementById("total-price").textContent = "$" + totalPrice.toFixed(2);
  const checkoutBtn = document.getElementById("checkout");
  const emptyMsg = document.getElementById("empty");
  if (cart.length) {
    checkoutBtn.removeAttribute("disabled");
    emptyMsg.style.display = "none";
  } else {
    checkoutBtn.setAttribute("disabled", "");
    emptyMsg.style.display = "";
  }
}
// ==============================================================================================================

function initDeleteModal(itemId) {
  const modal = document.getElementById("delete-modal");
  document.getElementById("delete-content").innerHTML = "";
  renderCartItem(
    "delete-content",
    richCartItems.find(item => item.id == itemId),
    true
  );
  document.getElementById("ok").dataset.id = itemId;
  modal.classList.remove("hidden");
  setTimeout(() => (modal.children[0].style.bottom = 0), 0);
}
// ==============================================================================================================

function closeDeleteModal() {
  const modal = document.getElementById("delete-modal");
  modal.children[0].style.bottom = "";
  setTimeout(() => modal.classList.add("hidden"), 300);
}
// ==============================================================================================================

async function deleteCartItem({ target: { dataset } }) {
  closeDeleteModal();

  const index = cart.findIndex(item => item.id == dataset.id);
  const removedItem = cart.splice(index, 1);

  document.getElementById("cart-container").children[index].classList.add("hidden");
  updatePage();

  try {
    await saveUserData(userId, { cart });

    showToast("Item successfully deleted", "green");
    document.getElementById("cart-container").children[index].remove();
    richCartItems.splice(index, 1);
  } catch (err) {
    showToast("Something went wrong!", "red");
    document.getElementById("cart-container").children[index].classList.remove("hidden");
    cart.splice(index, 0, removedItem);
  }
}
