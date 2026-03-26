import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export const useConnectedUser = () => {
  let context = useContext(UserContext);
  if (!context) {
    throw new Error("useConnectedUser must be used within a UserProvider");
  }

  const { connectedUser } = context;
  const isAdmin = connectedUser?.role === "admin";

  context = {
    ...context,
    connectedUser: {
      ...connectedUser,
      isAdmin,
    },
  };

  return context;
};
