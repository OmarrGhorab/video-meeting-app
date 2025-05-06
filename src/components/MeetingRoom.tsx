import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import {
  LayoutListIcon,
  LoaderIcon,
  UsersIcon,
  MessageSquareIcon,
} from "lucide-react";
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
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  VirtualizedMessageList,
  Window,
  useCreateChatClient,
} from "stream-chat-react";
import { useUser } from "@clerk/nextjs";
import { streamTokenProvider } from "@/actions/stream.actions";
import CustomVideoPlaceholder from "./CustomVideoPlaceholder";
import { EmojiPicker } from 'stream-chat-react/emojis';
import {  SearchIndex } from 'emoji-mart';

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const { user } = useUser();
  const call = useCall();

  const callingState = useCallCallingState();

  const chatClient = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: streamTokenProvider,
    userData: {
      id: user?.id!,
      name: user?.firstName + " " + user?.lastName,
      image: user?.imageUrl,
    },
  });

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-100px)] w-full overflow-hidden pt-2">
      {/* FLEX WRAPPER TO ENABLE SIDE PANELS */}
      <div className="relative h-full flex transition-all duration-300 ease-in-out">
        {/* VIDEO AREA */} 
        <div
          className={`transition-all duration-300 ease-in-out ${
            showChat || showParticipants ? "w-[calc(100%-400px)]" : "w-full"
          }`}
        >
          {layout === "grid" ? <PaginatedGridLayout VideoPlaceholder={CustomVideoPlaceholder} /> : <SpeakerLayout VideoPlaceholder={CustomVideoPlaceholder} />}
        </div>

        {/* PARTICIPANTS PANEL */}
        <div
          className={`absolute right-0 top-0 h-full w-[400px] border-[2px] rounded-[10px] p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out transform ${
            showParticipants ? "translate-x-0" : "translate-x-full"
          } shadow-xl z-50 overflow-y-auto`}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>

        {/* CHAT PANEL */}
        {chatClient && call && (
          <div
            className={`absolute right-0 top-0 h-full border-[2px] rounded-[10px] w-[400px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out transform ${
              showChat ? "translate-x-0" : "translate-x-full"
            } shadow-xl z-50`}
            onClick={(e) => e.stopPropagation()}
          >
            <Chat client={chatClient}>
              <Channel
                channel={chatClient.channel("livestream", call.id, {
                  name: "Chat",
                })}
                EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}
              >
                <Window>
                  <div className="flex flex-col h-full">
                    <ChannelHeader />
                    <div className="flex-1">
                      <VirtualizedMessageList />
                    </div>
                    <div>
                      <MessageInput 
                        additionalTextareaProps={{
                          onInput: (e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = '24px';
                            target.style.height = target.scrollHeight + 'px';
                          }
                        }}
                      />
                    </div>
                  </div>
                </Window>
              </Channel>
            </Chat>
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ease-in-out ${
        showChat || showParticipants ? "right-[400px]" : "right-0"
      }`}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center px-4">
            <CallControls onLeave={() => router.push("/")} />

            <div className={`flex items-center gap-3 ${showChat || showParticipants ? "flex-wrap justify-center" : ""}`}>
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
                onClick={() => {
                  setShowParticipants(!showParticipants);
                  if (!showParticipants) setShowChat(false);
                }}
              >
                <UsersIcon className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-10"
                onClick={() => {
                  setShowChat(!showChat);
                  if (!showChat) setShowParticipants(false);
                }}
              >
                <MessageSquareIcon className="size-4" />
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
