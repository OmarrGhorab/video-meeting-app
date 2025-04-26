import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils"; // optional utility function if you use one

function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      {/* Gradient Layer */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-100 group-hover:opacity-60 transition-opacity backdrop-blur-md",
          action.gradient
        )}
      />

      {/* Content */}
      <div className="relative p-6 h-full">
        <div className="space-y-4">
          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
              `bg-${action.color}/10`
            )}
          >
            <action.icon
              className={cn("h-6 w-6", `text-${action.color}`)}
            />
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {action.description}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ActionCard;
