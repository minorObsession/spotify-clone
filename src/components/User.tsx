import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

function User() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return <div></div>;
}

export default User;
