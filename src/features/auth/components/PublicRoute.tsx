import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const PublicRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};