import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";

interface AppContextContainerProps {
  children: ReactNode;
}

export function AppContextContainer({ children }: AppContextContainerProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
