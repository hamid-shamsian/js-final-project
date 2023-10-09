import http from "./httpService.js";

export const getBrands = () => http("get", "brands");

export const getBrandOfSlug = slug => http("get", `brands?slug=${slug}`);
