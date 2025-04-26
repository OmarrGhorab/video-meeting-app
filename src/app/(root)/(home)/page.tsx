"use client"
import ActionCard from "@/components/ActionCard";
import { Card } from "@/components/ui/card";
import { QUICK_ACTIONS } from "@/constants";
import { useQuery } from "convex/react";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import MeetingModal from "@/components/MeetingModal";

export default function Home() {
  const router = useRouter();
  // const meetings = useQuery(api.meetings.getUserMeetings)
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();
  
  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Meeting":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };
  return (
    <div className="container max-w-7xl mx-auto p-6">
      <Card className="col-span-2 p-10 rounded-2xl bg-muted">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <CalendarIcon className="h-10 w-10 text-primary" />
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <p className="text-base text-muted-foreground max-w-md">
            Manage and review your meetings with ease.
            Build connections and stay ahead.
          </p>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
      </div>
      <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
      />
    </div>
  );
}
