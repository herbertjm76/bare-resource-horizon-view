
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "!bg-background !text-foreground group border-border px-4 py-3 shadow-lg transition-all !rounded-lg data-[type=success]:!bg-green-50 data-[type=success]:!text-green-700 data-[type=success]:!border-green-200 data-[type=error]:!bg-red-50 data-[type=error]:!text-red-700 data-[type=error]:!border-red-200",
          title: "text-sm font-semibold",
          description: "text-sm",
          actionButton:
            "group-data-[type=success]:bg-green-100 group-data-[type=success]:text-green-700 group-data-[type=success]:hover:bg-green-200 group-data-[type=error]:bg-red-100 group-data-[type=error]:text-red-700 group-data-[type=error]:hover:bg-red-200",
          cancelButton:
            "group-data-[type=success]:bg-green-100 group-data-[type=success]:text-green-700 group-data-[type=success]:hover:bg-green-200 group-data-[type=error]:bg-red-100 group-data-[type=error]:text-red-700 group-data-[type=error]:hover:bg-red-200",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
