import { navigateTo } from "../router.js";
import User, { authUser, rememberUser } from "../services/userService.js";
import showToast from "../utils/toast.js";

export function init() {
  const form = document.querySelector("form");
  const signInBtn = document.querySelector("#sign-in");
  const seePwBtn = document.querySelector("#see-password");
  const [username, password] = form;

  form.addEventListener("input", () => {
    if (username.value && password.value) signInBtn.removeAttribute("disabled");
    else signInBtn.setAttribute("disabled", "");
  });

  seePwBtn.addEventListener("click", () => (form[1].type = form[1].type == "password" ? "text" : "password"));

  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (username.value && password.value) {
      const user = await authUser(username.value, password.value);
      if (user) {
        User.set(user);
        showToast("You are successfully Signed in.", "green");
        if (document.getElementById("remember").checked) rememberUser(username.value, password.value);
        navigateTo("/products");
      } else {
        showToast("Wrong Username or Password!", "red");
      }
    }
  });
}
