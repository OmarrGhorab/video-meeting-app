import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { ToastMessage } from "@/components/ToastMessage";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();

  const createInstantMeeting = async () => {
    if (!client) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: "Instant Meeting",
          },
        },
      });

      router.push(`/meeting/${call.id}`);
      toast.custom((t) => <ToastMessage t={{ type: "success", message: "Meeting Created" }} />);
    } catch (error) {
      console.error(error);
      toast.custom((t) => <ToastMessage t={{ type: "error", message: "Failed to create meeting" }} />);
    }
  };

  const joinMeeting = (callId: string) => {
    if (!client) return toast.custom((t) => <ToastMessage t={{ type: "error", message: "Failed to Join meeting" }} />);
    router.push(`/meeting/${callId}`);
  };

  return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;