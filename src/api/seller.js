// src/api/seller.js

const API_URL = "http://localhost:3000/api/v1";

export async function getSellers(token) {
  const res = await fetch(`${API_URL}/merchant`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch sellers");
  return res.json();
}
