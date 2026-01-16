import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or loader

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
