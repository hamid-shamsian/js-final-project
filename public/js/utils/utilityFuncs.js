export const getQueryParam = key => (key ? new URLSearchParams(location.search).get(key) : location.search.slice(1)); // if key is not passed, the whole search (query) string will be returned.

export const setQueryParam = (key, value) => window.history.replaceState({}, "", window.location.pathname + (value ? `?${key}=${value}` : ""));

export const debounce = (func, delay = 1000) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay, ...args);
  };
};
