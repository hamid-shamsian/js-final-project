import User from "./services/userService.js";
import showToast from "./utils/toast.js";

const routes = {
  "/": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!", hasJS: true },
  "/index.html": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!", hasJS: true },
  "/login": { fileName: "login", title: "Shoea | Login", hasJS: true },
  "/products": { fileName: "products", title: "Shoea | Products", hasJS: true },
  404: { fileName: "404", title: "Shoea | Page Not Found!", hasJS: false }
};
const spinner = document.getElementById("spinner");

export const navigateTo = input => {
  input.preventDefault?.(); // input has 2 valid types: maybe a normal string containing the relative path to go, or maybe an event object generated from clicking an anchor (a) element associated with a click event listener.
  window.history.pushState({}, "", input.target?.href ?? input); // 👈 above comment 👆
  RenderApp();
};

const RenderApp = async () => {
  spinner.style.display = "";

  const path = window.location.pathname;
  const { fileName, title, hasJS } = routes[path] ?? routes[404];

  if (User.get()) {
    switch (fileName) {
      case "onboarding":
        return navigateTo("/products");
      case "login":
        showToast("You are already Signed in!");
        return navigateTo("/products");
    }
  }

  document.title = title;

  try {
    const template = await fetch(`../templates/${fileName}.html`);
    const html = await template.text();
    document.getElementById("root").innerHTML = html;
    if (hasJS) {
      const module = await import(`./pages/${fileName}.js`);
      setTimeout(() => module.init?.(), 0); // invoke init function if it exists in the module (schedule to invoke it immediately after completion of returning html and parsing it to DOM)
    }
  } catch (err) {
    showToast("An Unexpected Error occured.\n(Usually Connection Error)\nTry refreshing the page.", "red");
  } finally {
    spinner.style.display = "none";
  }
};

window.onpopstate = RenderApp; // to make Back and Forward buttons of the browser still working...

export default RenderApp;
