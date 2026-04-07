import { Toaster as Sonner } from "sonner";

export function Toaster(props) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group font-sans! toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-none! rounded-md border-beige-500/50! p-5! items-start!",
          icon: "[&_svg]:mt-0.5",
          description: "group-[.toast]:text-grey-500!",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:bg-white! text-foreground! group-[.toaster]:border-red-200 [&_[data-icon]]:text-red-sec",
          success:
            "group-[.toaster]:bg-white! text-foreground! group-[.toaster]:text-green-600 group-[.toaster]:border-green-200 [&_[data-icon]]:text-green-sec",
        },
      }}
      {...props}
    />
  );
}
