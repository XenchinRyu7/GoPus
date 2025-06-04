const API_URL = "https://gopus-api-production.up.railway.app/api/v1";

export async function register(email, fullname, phone, password) {
  const payload = { email, fullname, phone, password };
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function login(email, password) {
  const payload = { email, password };
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
