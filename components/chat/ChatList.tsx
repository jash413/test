import React, { useEffect, useMemo, useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Conversation } from './types';
import { cn } from '@/lib/utils';
import { BiCheckDouble } from 'react-icons/bi';
import { getUserActivityStatus } from '@/lib/socket';

const ChatList = ({
  chat,
  userDetails,
  currentChat,
  onClickHandle
}: {
  chat: Conversation;
  userDetails: { id: number };
  currentChat?: Conversation | null;
  onClickHandle: (val: Conversation) => void;
}) => {
  const [isActive, setIsActive] = useState('');
  const messageContent =
    chat?.messages?.length > 0 ? chat?.messages[0]?.content : null;
  const fileName =
    chat?.messages?.length > 0 && chat?.messages[0]?.file_info
      ? (() => {
          try {
            const fileInfo = JSON.parse(chat?.messages[0]?.file_info);
            return Array.isArray(fileInfo) && fileInfo?.length > 0
              ? 'file'
              : null;
          } catch {
            return null;
          }
        })()
      : null;

  const getActivityStatus = async (userId: number) => {
    getUserActivityStatus(userId, (res) => {
      if (res.success) {
        setIsActive(res.data);
      }
    });
  };

  const targetUserId = useMemo(() => {
    return chat?.participants?.find(
      (participant) => participant?.id !== userDetails?.id
    )?.id;
  }, [chat, userDetails?.id]);

  useEffect(() => {
    if (targetUserId) {
      const fetchActivityStatus = async () => {
        await getActivityStatus(targetUserId);
      };
      fetchActivityStatus();
    }
  }, [chat, userDetails?.id]);

  return (
    <div
      key={chat?.id}
      id={`chat-${chat?.id}`}
      className={cn(
        'flex cursor-pointer items-center rounded-sm px-1.5 py-2',
        currentChat?.id === chat?.id ? 'bg-blue-100' : 'hover:bg-gray-100'
      )}
      onClick={() => onClickHandle(chat)}
    >
      <div className="relative w-max">
        <img
          src={'https://i.pravatar.cc/300'}
          alt="User Avatar"
          className="relative h-10 w-10 rounded-full"
        />
        {/* Status Dot */}
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full outline outline-white',
            isActive === 'active' ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      </div>
      <div className="ml-2 flex-1">
        <h3 className="text-sm font-semibold">
          {chat?.type === 'ONE_TO_ONE'
            ? chat?.participants?.find(
                (participant) => participant?.id !== userDetails?.id
              )?.name
            : chat?.type === 'GROUP'
            ? chat?.group_name
            : 'Group name'}
        </h3>
        <p className="text-xs text-gray-500">
          {messageContent || fileName || 'New chat'}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-400">
          {chat?.messages[0]?.created_at
            ? isToday(new Date(chat?.messages[0]?.created_at))
              ? format(new Date(chat?.messages[0]?.created_at), 'h:mm a')
              : isYesterday(new Date(chat?.messages[0]?.created_at))
              ? 'Yesterday'
              : format(new Date(chat?.messages[0]?.created_at), 'dd/MM/yyyy')
            : 'Time'}
        </span>
        {chat.hasNewMsg ? (
          <span className="h-4 w-4 rounded-full bg-blue-500 text-center text-xs text-white">
            {'2'}
          </span>
        ) : (
          <span>
            <BiCheckDouble />
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatList;
