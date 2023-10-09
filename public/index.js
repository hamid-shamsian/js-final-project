import RenderApp from "./js/router.js";
import User, { signedInUser } from "./js/services/userService.js";

export const state = {
  filteringBrandId: 0
};

User.set(await signedInUser());

RenderApp();
