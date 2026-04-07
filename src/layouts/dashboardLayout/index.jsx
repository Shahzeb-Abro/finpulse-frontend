import { Outlet } from "react-router-dom";
import { Sidebar, SidebarSmall } from "./components";

export const DashboardLayout = () => {
  return (
    <main className="flex flex-col-reverse lg:flex-row w-full h-dvh bg-beige-100">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="lg:hidden">
        <SidebarSmall />
      </div>
      <div className="flex-1 h-dvh overflow-y-auto">
        <Outlet />
      </div>
    </main>
  );
};
