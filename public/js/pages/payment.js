import { navigateTo } from "../router.js";
import { addOrder } from "../services/orderService.js";
import User from "../services/userService.js";
import showToast from "../utils/toast.js";

export const init = async () => {
  document.getElementById("back").addEventListener("click", e => history.back()); // we cant only use reference to history.back because as always an event object is passed to handler and that way(using only reference) we will get an error.

  document.getElementById("confirm").addEventListener("click", makeOrder);
  document.getElementById("ok").addEventListener("click", () => navigateTo("/orders"));
};

async function makeOrder() {
  const { id: userId, cart: items, lastUsedShipMtdId: shipMtdId, addresses } = User.get();
  const addressId = addresses.find(a => a.active).id;

  await addOrder({ userId, items, addressId, shipMtdId, id: Date.now() });

  showToast("Successfully Made Order :)", "green");
  document.getElementById("modal").style.display = "";
  items.length = 0;
}
