import http from "./httpService.js";

async function getUser(email) {
  try {
    return http("get", `users?email=${email}`);
  } catch (err) {
    null;
  }
}

// returns user object if the user with given username and password is authenticated: (otherwise returns undefined or false)
export async function authUser(username, password) {
  const [user] = await getUser(username);
  return user && user.password === password && user; // if first two expressions are true, it returns user.
}

// returns user object if a user data written in localstorage is authenticated: (otherwise returns undefined)
export async function signedInUser() {
  const signedInUser = JSON.parse(localStorage.getItem("user"));
  if (signedInUser) {
    const authenticatedUser = await authUser(signedInUser.u, signedInUser.p);
    return authenticatedUser || localStorage.removeItem("user"); // if the user data written in localstorage is not authenticated, then remove these false data from localstorage.
  }
}

export function rememberUser(username, password) {
  localStorage.setItem("user", JSON.stringify({ u: username, p: password }));
}

// 👇 because if we simply declare user by let and then export it, we cannot reassign the user from outside of this module by importing there!
const User = (() => {
  let user = null; // below set and get methods will have access to user through closure.

  return {
    set: givenUser => (user = givenUser),
    get: () => user
  };
})();

export default User;
