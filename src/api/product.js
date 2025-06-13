
const API_URL = "http://localhost:3000/api/v1";

export async function getProducts(token) {
  const res = await fetch(`${API_URL}/product`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
