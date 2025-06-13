const TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";
const TOKEN_EXP_KEY = "token_exp";

export function setToken(token, expiresIn = 3600) {
  localStorage.setItem(TOKEN_KEY, token);
  // Set expired time (default 1 jam)
  localStorage.setItem(TOKEN_EXP_KEY, Date.now() + expiresIn * 1000);
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

export function isTokenExpired() {
  const exp = localStorage.getItem(TOKEN_EXP_KEY);
  return exp && Date.now() > Number(exp);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(TOKEN_EXP_KEY);
}

export function isAuthenticated() {
  return !!getToken() && !isTokenExpired();
}

export function getUserRole() {
  const user = getUserData();
  return user ? user.role : null;
}
