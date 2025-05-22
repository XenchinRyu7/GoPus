
export const DUMMY_USER = {
  email: "admin@gopus.com",
  password: "GopusKuningan"
};

export function isAuthenticated() {
  return !!localStorage.getItem("gopus_login");
}

export function login(email, password) {
  if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
    localStorage.setItem("gopus_login", JSON.stringify({ email }));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("gopus_login");
}
