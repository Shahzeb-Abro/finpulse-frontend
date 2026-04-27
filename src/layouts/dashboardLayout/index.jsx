import { Outlet } from "react-router-dom";
import { EmailNotVerifiedBanner, Sidebar, SidebarSmall } from "./components";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/auth";

export const DashboardLayout = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getMe,
  });

  const userProfile = data?.data || null;

  console.log("User profile data:", userProfile);
  return (
    <main className="flex flex-col-reverse lg:flex-row w-full h-dvh bg-beige-100">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="lg:hidden">
        <SidebarSmall />
      </div>
      <div className="flex-1 h-dvh overflow-y-auto relative">
        {userProfile && !userProfile.isEmailVerified && (
          <EmailNotVerifiedBanner />
        )}
        <Outlet />
      </div>
    </main>
  );
};
