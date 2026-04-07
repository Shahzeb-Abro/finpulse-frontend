import AuthIllustration from "@/assets/auth-illustration.svg";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { CustomFormGroup } from "@/components/customFormGroup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useState } from "react";
import { IconEyeClosed, IconEyeOpen, IconGoogle } from "@/components/icons";
import { Logo } from "@/assets/svgs";
import { useMutation } from "@tanstack/react-query";
import { login, register } from "@/api/auth";
import { toast } from "sonner";

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
      <AuthIllustrationComponent />

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
          <div>
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

const ContinueWithGoogleButton = () => {
  const googleLoginUrl = `${import.meta.env.VITE_GOOGLE_AUTH_URL}`;
  return (
    <div>
      <a
        href={googleLoginUrl}
        className="flex items-center bg-beige-100 hover:bg-transparent cursor-pointer gap-3 p-3 justify-center rounded-md border border-input"
      >
        <IconGoogle />
        <span className="font-semibold text-sm">Continue with Google</span>
      </a>
      <div className="flex items-center gap-1 my-2">
        <span className="flex-1 h-px bg-grey-900/20"></span>
        <span className="text-center text-xs font-semibold text-grey-500">
          OR
        </span>
        <span className="flex-1 h-px bg-grey-900/20"></span>
      </div>
    </div>
  );
};

const AuthIllustrationComponent = () => {
  return (
    <div className="flex-[45%] p-5 hidden lg:block">
      <div
        className="bg-cover bg-center bg-no-repeat h-full flex flex-col gap-6 justify-between p-10 rounded-[12px]"
        style={{ backgroundImage: `url(${AuthIllustration})` }}
      >
        <div>
          <Logo />
        </div>
        <div className="flex flex-col gap-6 text-white">
          <h2 className="text-3xl font-bold">
            Keep track of your money and save for your future
          </h2>
          <p className="text-sm">
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>
    </div>
  );
};
