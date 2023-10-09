import User from "./services/userService.js";
import showToast from "./utils/toast.js";

const routes = {
  "/": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!" },
  "/index.html": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!" },
  "/login": { fileName: "login", title: "Shoea | Login" },
  "/home": { fileName: "home", title: "Shoea | Home" },
  "/brands": { fileName: "brands", title: "Shoea | Brands" },
  404: { fileName: "404", title: "Shoea | Page Not Found!", noJS: true }
};
const spinner = document.getElementById("spinner");

export const navigateTo = input => {
  input.preventDefault?.(); // input has 2 valid types: maybe a normal string containing the relative path to go, or maybe an event object generated from clicking an anchor (a) element associated with a click event listener.
  const path = input.currentTarget?.href ?? input; // 👈 above comment 👆   and currentTarget instead of target: because some <a> tags may have children like icons or spans...
  if (path == "404") RenderApp("404");
  else {
    window.history.pushState({}, "", path);
    RenderApp();
  }
};

const RenderApp = async notToBePushedPath => {
  spinner.style.display = "";

  const path = notToBePushedPath ?? window.location.pathname;
  const { fileName, title, noJS } = routes[path] ?? routes[404];

  if (fileName == "onboarding" || fileName == "login") {
    if (User.get()) {
      showToast("You are already Signed in!");
      return navigateTo("/home");
    }
  } else if (!User.get()) {
    showToast("Please Sign in first\nto use the App!");
    return navigateTo("/login");
  }

  document.title = title;

  try {
    const template = await fetch(`../templates/${fileName}.html`);
    const html = await template.text();
    document.getElementById("root").innerHTML = html;
    if (!noJS) {
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
