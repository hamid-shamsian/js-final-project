export function init() {
  const form = document.querySelector("form");
  const signInBtn = document.querySelector("#sign-in");
  const seePwBtn = document.querySelector("#see-password");

  form.addEventListener("input", () => {
    if (form[0].value && form[1].value) signInBtn.removeAttribute("disabled");
    else signInBtn.setAttribute("disabled", "");
  });

  seePwBtn.addEventListener("click", () => (form[1].type = form[1].type == "password" ? "text" : "password"));

  form.addEventListener("submit", e => {
    e.preventDefault();
    // if (form[0].value && form[1].value)
  });
}
