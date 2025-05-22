import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated, logout } from "@/utils/auth";
import { Button } from "@material-tailwind/react";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/sign-in", { replace: true });
  };

  // Optional: redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth/sign-in", { replace: true });
    }
  }, [navigate]);

  return (
    <Button color="red" onClick={handleLogout} className="ml-4">Logout</Button>
  );
}
