import { useContext } from "react";
import UserContext from "./UserContext";

export function useUserContext() {
  const userCtx = useContext(UserContext);

  if (!userCtx) {
    throw new Error(
      "UserContext is undefined. Make sure FileInput is wrapped in a UserContextProvider."
    );
  }

  return userCtx;
}
