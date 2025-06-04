const TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setUserData(userData) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

export function getUserData() {
  const data = localStorage.getItem(USER_DATA_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function getUserRole() {
  const user = getUserData();
  return user ? user.role : null;
}
