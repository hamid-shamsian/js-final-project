import { navigateTo } from "../router.js";
import User, { authUser, rememberUser } from "../services/userService.js";
import showToast from "../utils/toast.js";
import { animateOnFocusBlur } from "../services/domService.js";

export function init() {
  const form = document.querySelector("form");
  const signInBtn = document.getElementById("sign-in");
  const seePwBtn = document.getElementById("see-password");
  const [username, password] = form;

  animateOnFocusBlur(username, password);

  form.addEventListener("input", () => {
    if (username.value && password.value) signInBtn.removeAttribute("disabled");
    else signInBtn.setAttribute("disabled", "");
  });

  seePwBtn.addEventListener("click", function () {
    password.focus();
    password.type = password.type == "password" ? "text" : "password";
    this.classList.toggle("text-black");
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (username.value && password.value) {
      const user = await authUser(username.value, password.value);
      if (user) {
        User.set(user);
        showToast("You are successfully Signed in.", "green");
        if (document.getElementById("remember").checked) rememberUser(username.value, password.value);
        navigateTo("/home");
      } else {
        showToast("Wrong Username or Password!", "red");
      }
    }
  });
}
