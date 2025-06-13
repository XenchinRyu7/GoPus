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

export async function addSeller(token, data, isFormData = false) {
  const headers = isFormData
    ? { Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_URL}/merchant`, {
    method: "POST",
    headers,
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add seller");
  return res.json();
}

export async function updateSeller(token, id, data, isFormData = false) {
  const headers = isFormData
    ? { Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_URL}/merchant/${id}`, {
    method: "PUT",
    headers,
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update seller");
  return res.json();
}

export async function deleteSeller(token, id) {
  const res = await fetch(`${API_URL}/merchant/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete seller");
  return res.json();
}