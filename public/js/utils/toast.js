import toastifyJs from "https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/+esm";

export default function showToast(text, color) {
  toastifyJs({
    text,
    duration: 3000,
    className: "rounded-full",
    // close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: color
    }
  }).showToast();
}
