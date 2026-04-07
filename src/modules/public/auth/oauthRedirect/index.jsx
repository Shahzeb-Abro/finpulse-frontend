import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const OAuthRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }, [navigate]);
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <p className="text-sm font-medium text-foreground">
        Successfully signed in. Redirecting to application...
      </p>
    </div>
  );
};
