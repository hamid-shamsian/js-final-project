import config from "../../config.json" assert { type: "json" };
import showToast from "../utils/toast.js";

export default async function http(method, resource, body) {
  try {
    const res = await fetch(config.API_URL + resource, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.status === 404) return showToast("Resource Not Found!", "red");
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    if (err.message == "Failed to fetch") showToast("Connection Error!", "red");
    else throw err;
  }
}
