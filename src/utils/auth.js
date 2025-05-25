export const DUMMY_USERS = [
  {
    email: "admin@gopus.com",
    password: "GopusKuningan",
    role: "admin",
  },
  {
    email: "user@gopus.com",
    password: "GopusUser",
    role: "user",
  },
];

export function isAuthenticated() {
  return !!localStorage.getItem("gopus_login");
}

export function login(email, password) {
  const user = DUMMY_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    localStorage.setItem(
      "gopus_login",
      JSON.stringify({ email: user.email, role: user.role })
    );
    return user.role;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("gopus_login");
}

export function getUserRole() {
  const data = localStorage.getItem("gopus_login");
  if (!data) return null;
  try {
    return JSON.parse(data).role;
  } catch {
    return null;
  }
}
