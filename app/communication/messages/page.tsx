import React from 'react';
import ChatBox from '@/components/chat/ChatBox';
import { auth } from '@/auth';

const ChatPage = async () => {
  const session = await auth();
  const token = session?.user?.apiUserToken as string;
  const userDetails = session?.user;

  console.log('token', token);

  return (
    <div className="flex h-full w-full px-8 py-8">
      <ChatBox token={token} userDetails={userDetails} />
    </div>
  );
};

export default ChatPage;
