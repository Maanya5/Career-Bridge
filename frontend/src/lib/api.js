const TOKEN_KEY = "careerbridge_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  const t = token ?? getStoredToken();
  if (t) headers.Authorization = `Bearer ${t}`;

  const res = await fetch(path, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || res.statusText };
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}
