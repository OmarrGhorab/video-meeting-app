'use client'

import { ReactNode, useEffect, useState } from 'react';
import { Channel as StreamChannel, User } from 'stream-chat';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  VirtualizedMessageList,
  Window,
  useCreateChatClient,
} from 'stream-chat-react';
import { streamTokenProvider } from "@/actions/stream.actions";

import { useUser } from '@clerk/nextjs';
type Props = {
    children: ReactNode;
  };

const StreamChatProvider = ({ children }: Props) => {
  const [channel, setChannel] = useState<StreamChannel>();
  const { user } = useUser();
  const chatClient = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: streamTokenProvider,
    userData: {
      id: user?.id!,
      name: user?.firstName + " " + user?.lastName,
      image: user?.imageUrl,
    },
  });

  useEffect(() => {
    if (!chatClient) return;

    const spaceChannel = chatClient.channel('livestream', 'messaging', {
      image: 'https://goo.gl/Zefkbx',
      name: 'messaging launch discussion',
    });

    setChannel(spaceChannel);
  }, [chatClient]);

   if (!chatClient) return <div>Setting up client & connection...</div>;

  return (
    <Chat client={chatClient}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader live />
          <VirtualizedMessageList />
          <MessageInput focus />
        </Window>
      </Channel>
    </Chat>
  );
};

export default StreamChatProvider;