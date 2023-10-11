import User from "./services/userService.js";
import showToast from "./utils/toast.js";

const routes = {
  "/": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!" },
  "/login": { fileName: "login", title: "Shoea | Login" },
  "/home": { fileName: "home", title: "Shoea | Home" },
  "/brands": { fileName: "brands", title: "Shoea | Brands" },
  "/most-popular": { fileName: "mostPopular", title: "Shoea | Most Popular" },
  "/product": { fileName: "product", title: "Shoea | Product Details" },
  "/cart": { fileName: "cart", title: "Shoea | Cart" },
  "/checkout": { fileName: "checkout", title: "Shoea | Checkout" },
  404: { fileName: "404", title: "Shoea | Page Not Found!", noJS: true }
};
const spinner = document.getElementById("spinner");

export const navigateTo = input => {
  if (input == 404) return RenderApp(true);

  input.preventDefault?.(); // input has 2 valid types: maybe a normal string containing the relative path to go, or maybe an event object generated from clicking an anchor (a) element associated with a click event listener.
  const path = input.currentTarget?.href ?? input; // 👈 above comment 👆   and currentTarget instead of target: because some <a> tags may have children like icons or spans...

  window.history.pushState({}, "", path);
  RenderApp();
};

const RenderApp = async is404 => {
  spinner.style.display = "";

  const path = is404 ? "404" : window.location.pathname; // when a true is404 argument (or any truthy value) is passed to function, then 404 page is only about to be rendered but the url of the browser is not gonna be changed (the url should not change for loading 404 page when a wrong url is entered by user.)
  const user = User.get();

  // Protecting Routs: ==========================
  if (path == "/" || path == "/login") {
    if (user) {
      showToast("You are already Signed in!"); // redirect signed-in users from onboarding or login pages to home page.
      return navigateTo("/home");
    }
  } else if (!user) {
    showToast("Please Sign in first\nto use the App!"); // protect all routes (except onboarding & login) against none-signed-in users.
    return navigateTo("/login");
  } else if (path == "/checkout" && !user.cart?.length) {
    showToast("Your Cart is Empty!", "orangered"); // protect checkout page against signed-in users with no cart item.
    return navigateTo("/home");
  }
  // ============================================

  const { title, fileName, noJS } = routes[path] ?? routes[404];
  document.title = title;

  // Fetching Resources of the page: ============
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
  // ============================================
};

window.onpopstate = e => RenderApp(); // to make Back and Forward buttons of the browser still working... (i used arrow function instead of simply assigning RenderApp function reference because onpopstate event on window passes an event object to the handler function and this will interfere with the RenderApp parameter functionality.)

export default RenderApp;
