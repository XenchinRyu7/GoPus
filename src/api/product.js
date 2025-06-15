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

export async function addProduct(token, data, isFormData = false) {
  const headers = isFormData
    ? { Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_URL}/product`, {
    method: "POST",
    headers,
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}

export async function updateProduct(token, id, data, isFormData = false) {
  const headers = isFormData
    ? { Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const res = await fetch(`${API_URL}/product/${id}`, {
    method: "PUT",
    headers,
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(token, id) {
  const res = await fetch(`${API_URL}/product/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function getProductsByMerchant(token, merchant_id) {
  const res = await fetch(`${API_URL}/product?merchant_id=${merchant_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch products by merchant");
  return res.json();
}
