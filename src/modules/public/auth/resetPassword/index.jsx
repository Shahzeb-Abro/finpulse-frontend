import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validations";
import { CustomFormGroup } from "@/components/customFormGroup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/assets/svgs";
import { AuthIllustration } from "../components";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IconEyeClosed, IconEyeOpen } from "@/components/icons";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/auth";
import { toast } from "sonner";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetUserPassword, isPending: isResettingPassword } =
    useMutation({
      mutationFn: resetPassword,
      onSuccess: (data) => {
        toast.success(
          data.message || "Password reset successful! You can now log in.",
        );
        navigate("/login");
      },
      onError: (error) => {
        toast.error(error || "An error occurred while resetting the password.");
      },
    });

  const onSubmit = (data) => {
    const requestBody = {
      token,
      newPassword: data.password,
    };

    resetUserPassword(requestBody);
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
            Reset Password
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <CustomFormGroup
                    label="Password"
                    name="password"
                    error={form.formState.errors.password?.message}
                  >
                    <Input
                      {...field}
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      postComponent={
                        <div
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                        >
                          {isPasswordVisible ? (
                            <span className="text-foreground">
                              <IconEyeClosed />
                            </span>
                          ) : (
                            <span className="text-foreground">
                              <IconEyeOpen />
                            </span>
                          )}
                        </div>
                      }
                    />
                  </CustomFormGroup>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <CustomFormGroup
                    label="Confirm Password"
                    name="confirmPassword"
                    error={form.formState.errors.confirmPassword?.message}
                  >
                    <Input
                      {...field}
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
                      postComponent={
                        <div
                          onClick={() =>
                            setIsConfirmPasswordVisible(
                              !isConfirmPasswordVisible,
                            )
                          }
                        >
                          {isConfirmPasswordVisible ? (
                            <span className="text-foreground">
                              <IconEyeClosed />
                            </span>
                          ) : (
                            <span className="text-foreground">
                              <IconEyeOpen />
                            </span>
                          )}
                        </div>
                      }
                    />
                  </CustomFormGroup>
                )}
              />
            </div>
            <Button
              className="w-full mt-8"
              type="submit"
              isLoading={isResettingPassword}
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};
