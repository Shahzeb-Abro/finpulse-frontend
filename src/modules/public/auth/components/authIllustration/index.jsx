import AuthIllustrationImage from "@/assets/auth-illustration.svg";
import { Logo } from "@/assets/svgs";

export const AuthIllustration = () => {
  return (
    <div className="flex-[45%] p-5 hidden lg:block">
      <div
        className="bg-cover bg-center bg-no-repeat h-full flex flex-col gap-6 justify-between p-10 rounded-[12px]"
        style={{ backgroundImage: `url(${AuthIllustrationImage})` }}
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
