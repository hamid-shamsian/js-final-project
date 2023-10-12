import User from "../services/userService.js";
import { navigateTo } from "../router.js";
import showToast from "../utils/toast.js";

export const init = () => {
  document.querySelectorAll("a").forEach(a => a.addEventListener("click", navigateTo));
  document.getElementById("sign-out").addEventListener("click", signOut);
};

function signOut() {
  localStorage.removeItem("user");
  User.set(null);
  showToast("GoodBye!\nHope See You again Soon 😉");
  navigateTo("/");
}
