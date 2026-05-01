import { Preferences } from "./components";

export const Settings = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
      </div>

      <div className="max-w-3xl  mx-auto mt-8 lg:mt-12 flex flex-col gap-8 w-full">
        <Preferences />
      </div>
    </div>
  );
};
