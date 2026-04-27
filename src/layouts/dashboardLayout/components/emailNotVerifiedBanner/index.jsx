import { resendVerificationEmail } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const EmailNotVerifiedBanner = () => {
  const {
    mutate: resendVerificationEmailMutation,
    isPending: isResendingVerificationEmail,
  } = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (data) => {
      console.log("Verification email resent:", data);
      toast.success(
        data.message || "Verification email resent! Please check your inbox.",
      );
    },
    onError: (error) => {
      console.error("Failed to resend verification email:", error);
      toast.error(
        error?.message ||
          "Failed to resend verification email. Please try again.",
      );
    },
  });
  return (
    <div className="p-6 rounded-xl bg-white/70 border backdrop-blur-sm z-[1000] text-center sticky top-4 mx-4">
      <div className="flex items-center gap-4 justify-between">
        <p className="text-left font-medium">
          Your email is not verified. Please check your inbox and click on the
          verification link to access all features.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline">Close</Button>
          <Button
            onClick={() => resendVerificationEmailMutation()}
            disabled={isResendingVerificationEmail}
          >
            {isResendingVerificationEmail
              ? "Resending..."
              : "Resend Verification Email"}
          </Button>
        </div>
      </div>
    </div>
  );
};
