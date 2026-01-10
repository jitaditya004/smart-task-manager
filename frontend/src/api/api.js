const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function apifetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Optional: auto-handle auth errors
  if (res.status === 401) {
    console.warn("Unauthorized");
  }

  return res;
}
