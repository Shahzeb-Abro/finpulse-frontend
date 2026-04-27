import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, loginSchema } from "@/lib/validations";
import { CustomFormGroup } from "@/components/customFormGroup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/assets/svgs";
import { AuthIllustration } from "../components";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth";
import { toast } from "sonner";

export const ForgotPassword = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: requestResetLink, isPending: isRequestingResetLink } =
    useMutation({
      mutationFn: forgotPassword,
      onSuccess: (data) => {
        toast.success(
          data.message ||
            "Password reset link sent successfully! Check your email.",
        );
        form.reset();
      },
      onError: (error) => {
        toast.error(
          error || "An error occurred while requesting password reset.",
        );
      },
    });

  const onSubmit = (data) => {
    requestResetLink(data);
  };

  return (
    <main className="bg-beige-100 w-full h-dvh flex flex-col lg:flex-row overflow-hidden">
      {/* Top Banner (Smaller Screens) */}
      <div className="w-full lg:hidden bg-grey-900 py-6 px-10 rounded-b-[8px] flex items-center justify-center shrink-0">
        <Logo />
      </div>
      {/* Auth Illustration   */}
      <AuthIllustration />

      {/* Form Component  */}
      <div className="flex-[55%] flex items-center justify-center px-4 py-8 min-h-0 overflow-y-auto">
        <div className="rounded-[12px] bg-white p-8 max-w-140 flex flex-col gap-8 w-full my-auto">
          <div className="text-3xl font-bold text-foreground">
            Forgot Password
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <CustomFormGroup
                    label="Email"
                    name="email"
                    error={form.formState.errors.email?.message}
                  >
                    <Input {...field} placeholder="Email" />
                  </CustomFormGroup>
                )}
              />
            </div>
            <Button
              className="w-full mt-8"
              type="submit"
              isLoading={isRequestingResetLink}
            >
              Request Reset Link
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};
