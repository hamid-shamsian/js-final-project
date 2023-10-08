export function toggleInputsBorderOnFocusBlur(...inputs) {
  inputs.forEach(i => {
    i.addEventListener("focus", function () {
      this.parentElement.classList.add("border-black");
    });
    i.addEventListener("blur", function () {
      this.parentElement.classList.remove("border-black");
    });
  });
}
