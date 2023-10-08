export function animateOnFocusBlur(...inputs) {
  inputs.forEach(i => {
    i.addEventListener("focus", function () {
      this.parentElement.classList.add("focused-input");
      this.previousElementSibling.classList.add("fa-lg");
    });
    i.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused-input");
      this.previousElementSibling.classList.remove("fa-lg");
    });
  });
}
