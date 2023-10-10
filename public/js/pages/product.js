import { navigateTo } from "../router.js";
import { renderShoeDetails, nextImage, prevImage } from "../services/domService.js";
import { getShoe } from "../services/shoeService.js";
import { saveUserData } from "../services/userService.js";
import { getQueryParam } from "../utils/utilityFuncs.js";
import User from "./../services/userService.js";
import showToast from "../utils/toast.js";

const order = { qty: 1 };
let unitPrice = null;

export const init = async () => {
  document.getElementById("back").addEventListener("click", () => history.back());

  const productId = getQueryParam("id");
  try {
    const product = await getShoe(productId);
    renderShoeDetails(product);

    order.productId = product.id;
    order.size = product.sizes[0];
    order.color = product.colors[0];
    unitPrice = product.price;
  } catch (err) {
    return navigateTo(404);
  }

  document.getElementById("next").addEventListener("click", nextImage);
  document.getElementById("prev").addEventListener("click", prevImage);
  document.getElementById("sizes").addEventListener("click", changeSize);
  document.getElementById("colors").addEventListener("click", changeColor);
  document.getElementById("qty").addEventListener("click", changeQty);
  document.getElementById("add").addEventListener("click", addToCart);
};

function changeSize(e) {
  if (e.target.nodeName == "SPAN") {
    this.querySelector(`span[data-size="${order.size}"]`).classList.remove("active-filter");
    order.size = e.target.dataset.size;
    e.target.classList.add("active-filter");
  }
}

function changeColor(e) {
  if (e.target.nodeName == "SPAN") {
    this.querySelector(`span[data-color="${order.color}"]`).children[0].remove();
    order.color = e.target.dataset.color;
    e.target.innerHTML = '<i class="fa fa-check fa-xl text-white"></i>';
  }
}

function changeQty(e) {
  if (e.target.nodeName == "I") {
    order.qty += +e.target.dataset.step;
    order.qty ||= 1;
    if (order.qty > +this.dataset.max) order.qty = +this.dataset.max;
    this.children[1].textContent = order.qty;
    document.getElementById("total-price").textContent = "$" + (order.qty * unitPrice).toFixed(2);
  }
}

async function addToCart() {
  const { id, cart = [] } = User.get();
  if (cart.find(p => p.productId == order.productId)) return showToast("This Product is already added to your Cart!", "orangered");
  const updatedUser = await saveUserData(id, { cart: [...cart, order] });
  User.set(updatedUser);
  showToast("Added to your Cart", "green");
}
