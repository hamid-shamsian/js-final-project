import User from "../services/userService.js";
import { navigateTo } from "../router.js";
import { getActiveOrdersOfUserId, getCompletedOrdersOfUserId } from "../services/orderService.js";
import { renderCartItem } from "../services/domService.js";
import { getShoe } from "../services/shoeService.js";

let isFirstTab = true;

export const init = async () => {
  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo));
  document.getElementById("tabs").addEventListener("click", changeTabs);

  const { id: userId } = User.get();
  let richData;

  const activeOrders = await getActiveOrdersOfUserId(userId);
  if (activeOrders.length) {
    richData = await getRichProductsDataOfItems(activeOrders);
    richData.forEach(item => renderCartItem("active-container", item, true));
  } else {
    document.getElementById("active-container").children[0].style.display = "";
  }

  const completedOrders = await getCompletedOrdersOfUserId(userId);
  if (completedOrders.length) {
    richData = await getRichProductsDataOfItems(completedOrders);
    richData.forEach(item => renderCartItem("completed-container", item, true));
  } else {
    document.getElementById("completed-container").children[0].style.display = "";
  }
};

async function getRichProductsDataOfItems(items) {
  const ordersItems = items.map(o => o.items).flat();
  const products = await Promise.all(ordersItems.map(item => getShoe(item.productId)));
  return ordersItems.map((item, i) => ({
    ...item,
    title: products[i].title,
    inStock: products[i].inStock,
    image: products[i].images[0]
  }));
}

function changeTabs({ target }) {
  if (target.nodeName == "H2") {
    isFirstTab = target.id == "active";

    const tab1 = document.getElementById("active");
    const tab2 = document.getElementById("completed");

    if (isFirstTab) {
      tab1.classList.add("active-tab");
      tab2.classList.remove("active-tab");
    } else {
      tab1.classList.remove("active-tab");
      tab2.classList.add("active-tab");
    }

    document.getElementById("active-container").style.display = isFirstTab ? "" : "none";
    document.getElementById("completed-container").style.display = isFirstTab ? "none" : "";
  }
}
