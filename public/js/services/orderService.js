import http from "./httpService.js";

export const getShippingMethods = () => http("get", "shippingMethods");

export const addOrder = order => http("post", "activeOrders", order);
