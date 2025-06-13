const API_URL = "http://localhost:3000/api/v1";
import { getToken } from "@/utils/auth";

export async function createOrder(orderData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function getOrdersByCustomer(customer_id) {
  const token = getToken();
  const res = await fetch(`${API_URL}/order?customer_id=${customer_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function getOrdersByPlace(place_id) {
  const token = getToken();
  const res = await fetch(`${API_URL}/order?place_id=${place_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders by place");
  return res.json();
}

export async function updateOrderStatus(orderId, status) {
  const token = getToken();
  const res = await fetch(`${API_URL}/order/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}
