import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { LayoutListIcon, LoaderIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden">
      {/* VIDEO LAYOUT */}
      <div className="relative h-full">
        {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

        {/* PARTICIPANTS LIST OVERLAY */}
        <div
          className={`absolute right-[-5px] top-0 h-full w-[300px] p-8  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out ${
            showParticipants ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* VIDEO CONTROLS */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center px-4">
            <CallControls onLeave={() => router.push("/")} />

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="size-10">
                    <LayoutListIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLayout("grid")}>
                    Grid View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLayout("speaker")}>
                    Speaker View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                className="size-10"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <UsersIcon className="size-4" />
              </Button>

              <EndCallButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MeetingRoom;