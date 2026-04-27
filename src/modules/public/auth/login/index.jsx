import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { CustomFormGroup } from "@/components/customFormGroup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useState } from "react";
import { IconEyeClosed, IconEyeOpen } from "@/components/icons";
import { Logo } from "@/assets/svgs";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { toast } from "sonner";
import { AuthIllustration, ContinueWithGoogleButton } from "../components";

export const Login = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      toast.success("Login successful!");
      navigate(ROUTES.overview);
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error(error?.message || "Login failed. Please try again.");
    },
  });

  const onSubmit = (data) => {
    loginUser(data);
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
          <div className="text-3xl font-bold text-foreground">Login</div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="my-3">
              <ContinueWithGoogleButton />
            </div>

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
            </div>
            <Button className="w-full mt-8" isLoading={isPending} type="submit">
              Login
            </Button>
          </form>
          <div className="flex flex-col gap-4">
            <Link
              to={ROUTES.forgotPassword}
              className="text-sm underline font-bold"
            >
              Forgot Password?
            </Link>
            <p className="text-center text-sm text-grey-500">
              Need to create an account?{" "}
              <Link
                className="text-grey-900 underline font-bold"
                to={ROUTES.register}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
