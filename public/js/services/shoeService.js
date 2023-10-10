import http from "./httpService.js";

export const getShoes = (ofBrandId, popularitySort, count) => {
  const url = `${ofBrandId ? `brands/${ofBrandId}/` : ""}shoes${popularitySort ? "?_sort=ratings&_order=desc" : ""}${
    count ? `&_limit=${count}` : ""
  }`;
  return http("GET", url);
};

export const getShoe = id => http("get", `shoes/${id}`);
