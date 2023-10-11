import http from "./httpService.js";

export const getShippingMethods = () => http("get", "shippingMethods");

export const addOrder = order => http("post", "activeOrders", order);

export const getActiveOrdersOfUserId = id => http("get", `users/${id}/activeOrders`);

export const getCompletedOrdersOfUserId = id => http("get", `users/${id}/completedOrders`);
