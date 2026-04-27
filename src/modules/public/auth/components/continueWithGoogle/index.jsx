import { IconGoogle } from "@/components/icons";

export const ContinueWithGoogleButton = () => {
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
