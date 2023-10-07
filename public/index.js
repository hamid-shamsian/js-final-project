import RenderApp from "./js/router.js";
import User, { signedInUser } from "./js/services/userService.js";

User.set(await signedInUser());

RenderApp();
