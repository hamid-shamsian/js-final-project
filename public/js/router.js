import showToast from "./utils/toast.js";

const routes = {
  "/": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!" },
  "/index.html": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!" },
  "/login": { fileName: "login", title: "Shoea | Login" },
  "/products": { fileName: "products", title: "Shoea | Products" },
  404: { fileName: "404", title: "Shoea | Page Not Found!" }
};
const spinner = document.getElementById("spinner");

export const navigateTo = async input => {
  input.preventDefault?.(); // input has 2 valid types: maybe a normal string containing the relative path to go, or maybe an event object generated from clicking an anchor (a) element associated with a click event listener.
  window.history.pushState({}, "", input.target?.href ?? input); // 👈 above comment 👆
  document.getElementById("root").innerHTML = await renderApp();
};

const renderApp = async () => {
  spinner.classList.remove("hidden");

  const path = window.location.pathname;
  const { fileName, title } = routes[path] ?? routes[404];

  document.title = title;

  try {
    const page = await fetch(`../templates/${fileName}.html`);
    const html = await page.text();

    const module = await import(`./pages/${fileName}.js`);
    setTimeout(() => module.init?.(), 0); // invoke init function if it exists in the module (schedule to invoke it immediately after completion of returning html and parsing it to DOM)

    spinner.classList.add("hidden");

    return html;
  } catch (err) {
    showToast("An Unexpected Error occured.\n(usually Connection Error)\nTry refreshing the page.", "red");
  }
};

window.onpopstate = renderApp; // to make Back and Forward buttons of the browser still working...

export default renderApp;
