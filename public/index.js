const navigateTo = e => {
  // e = e || window.event;
  e.preventDefault();
  window.history.pushState({}, "", e.target.href);
  renderPage();
};

const routes = {
  "/": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!" },
  "/index.html": { fileName: "onboarding", title: "Shoea | Get inspired and Buy!" },
  "/login": { fileName: "login", title: "Shoea | Login" },
  "/products": { fileName: "products", title: "Shoea | Products" },
  404: { fileName: "404", title: "Shoea | Page Not Found!" }
};

const renderPage = async () => {
  const path = window.location.pathname;
  const { fileName, title } = routes[path] || routes[404];

  document.title = title;

  const page = await fetch(`./templates/${fileName}.html`);
  const html = await page.text();
  document.getElementById("root").innerHTML = html;

  const module = await import(`./js/${fileName}.js`);
  module.init?.(); // invoke init function if it exists in the module :)
};

window.onpopstate = renderPage;
// window.route = navigateTo;

renderPage();
