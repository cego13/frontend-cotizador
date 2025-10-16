export function useAuth() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return {
    token,
    user,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
  };
}
