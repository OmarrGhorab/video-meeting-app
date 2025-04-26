import { CheckCircle, AlertCircle } from "lucide-react"; 
import { cn } from "@/lib/utils";

interface ToastMessageProps {
  t: {
    type: "success" | "error";
    message: string;
  };
}

export const ToastMessage = ({ t }: ToastMessageProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg shadow-md border",
        t.type === "success" ? "bg-green-100 border-green-300 text-green-800" : "bg-red-100 border-red-300 text-red-800"
      )}
    >
      {t.type === "success" ? (
        <CheckCircle className="w-6 h-6 text-green-600" />
      ) : (
        <AlertCircle className="w-6 h-6 text-red-600" />
      )}
      <p className="text-sm font-medium">{t.message}</p>
    </div>
  );
};
