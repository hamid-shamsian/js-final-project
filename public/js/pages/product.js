import { navigateTo } from "../router.js";
import { renderShoeDetails, nextImage, prevImage } from "../services/domService.js";
import { getShoe } from "../services/shoeService.js";
import { saveUserData } from "../services/userService.js";
import { getQueryParam } from "../utils/utilityFuncs.js";
import User from "./../services/userService.js";
import showToast from "../utils/toast.js";

const data = {};

export const init = async () => {
  document.getElementById("back").addEventListener("click", e => history.back()); // we cant only use reference to history.back because as always an event object is passed to handler and that way(using only reference) we will get an error.

  const productId = getQueryParam("id");
  try {
    const product = await getShoe(productId);
    renderShoeDetails(product);

    data.productId = product.id;
    data.size = product.sizes[0];
    data.color = product.colors[0];
    data.qty = 1;
    data.price = product.price;
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
    this.querySelector(`span[data-size="${data.size}"]`).classList.remove("active-filter");
    data.size = e.target.dataset.size;
    e.target.classList.add("active-filter");
  }
}

function changeColor(e) {
  if (e.target.nodeName == "SPAN") {
    this.querySelector(`span[data-color="${data.color}"]`).children[0].remove();
    data.color = e.target.dataset.color;
    e.target.innerHTML = '<i class="fa fa-check fa-xl text-white"></i>';
  }
}

function changeQty(e) {
  if (e.target.nodeName == "I") {
    data.qty += +e.target.dataset.step;
    data.qty ||= 1;
    if (data.qty > +this.dataset.max) data.qty = +this.dataset.max;
    this.children[1].textContent = data.qty;
    document.getElementById("total-price").textContent = "$" + (data.qty * data.price).toFixed(2);
  }
}

async function addToCart() {
  const { id, cart = [] } = User.get();
  // console.log(order, cart);

  if (cart.find(i => i.productId == data.productId && i.color == data.color && i.size == data.size))
    return showToast("This Product is already added to your Cart!", "orangered");

  data.id = Date.now();
  cart.push(data);

  try {
    await saveUserData(id, { cart });
    showToast("Added to your Cart", "green");
  } catch (err) {
    showToast("Something went wrong!", "red");
    cart.pop();
  }
}
