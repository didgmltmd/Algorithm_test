import type { ReactNode } from "react";
import { Header } from "./Header";

type LayoutProps = {
  children: ReactNode;
  onHome: () => void;
};

export const Layout = ({ children, onHome }: LayoutProps) => (
  <div className="min-h-screen bg-white">
    <Header onHome={onHome} />
    {children}
  </div>
);
