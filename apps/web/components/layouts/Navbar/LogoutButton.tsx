"use client";

import { logOut } from "auth/util/actions";
import styles from "./Navbar.module.css";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  const handleLogout = async () => {
    await logOut();
  };

  return (
    <button onClick={handleLogout} className={className || styles.logoutBtn}>
      Logout
    </button>
  );
};

export default LogoutButton;
