import http from "./httpService.js";

export const getBrands = () => http("get", "brands");
