import http from "./httpService.js";

export const getShippingMethods = () => http("get", "shippingMethods");
