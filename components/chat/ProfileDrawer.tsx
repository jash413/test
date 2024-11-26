import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { Conversation } from './types';
import { leaveConversation, updateGroupProfilePicture } from '@/lib/socket';
import { TiCamera } from 'react-icons/ti';

const ProfileDrawer = ({
  open,
  setOpen,
  chat,
  currentUser,
  resetChatDetails,
  token
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  chat: Conversation | null;
  currentUser: any;
  resetChatDetails: () => void;
  token: string;
}) => {
  const [showMore, setShowMore] = useState(false);
  const [grpImgPreview, setGrpImgPreview] = useState(
    chat?.profile_picture || ''
  );
  const [groupImg, setGroupImg] = useState<File | null>(null);

  const sortedParticipants =
    chat?.type === 'GROUP'
      ? [
          chat.participants.find(
            (participant) => participant.id === currentUser?.id
          ),
          ...chat.participants.filter(
            (participant) => participant.id !== currentUser?.id
          )
        ]
      : chat?.participants;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGrpImgPreview(URL.createObjectURL(file));
      setGroupImg(file as File);
    }
  };

  const handleUpdateProfilePicture = () => {
    if (groupImg) {
      updateGroupProfilePicture(chat?.id as number, groupImg, (response) => {
        // You can handle the response if needed
        setGroupImg(null);
      });
    }
  };

  return (
    <>
      {open && (
        <div
          className={cn(
            'h-full w-1/4 bg-white p-4 transition-all duration-300',
            open ? 'w-full lg:w-1/4' : 'w-1/4'
          )}
        >
          <div className="flex h-full w-full flex-col items-start justify-start">
            <div className="flex w-full items-center justify-end">
              <button
                onClick={() => {
                  setOpen(false);
                }}
              >
                <VscChromeClose size={25} />
              </button>
            </div>
            <div className="scrollbar-thumb-rounded-full h-full max-h-[80vh] w-full overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
              {/* Profile Information one to one chat */}
              {chat?.type === 'ONE_TO_ONE' && (
                <div className="mt-4 flex w-full flex-col items-center gap-0.5">
                  <img
                    src="https://i.pravatar.cc/300"
                    alt="Profile Avatar"
                    className="h-20 w-20 rounded-full border-2 border-purple-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://i.pravatar.cc/300';
                    }}
                  />
                  <h2
                    className="mt-2 truncate text-base font-semibold"
                    title={
                      chat?.participants.find(
                        (participant) => participant.id !== currentUser?.id
                      )?.name
                    }
                  >
                    {
                      chat?.participants.find(
                        (participant) => participant.id !== currentUser?.id
                      )?.name
                    }
                  </h2>
                  <p
                    className="truncate text-xs text-gray-500"
                    title={
                      chat?.participants.find(
                        (participant) => participant.id !== currentUser?.id
                      )?.email
                    }
                  >
                    {
                      chat?.participants.find(
                        (participant) => participant.id !== currentUser?.id
                      )?.email
                    }
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                    <span className="ml-1 text-xs text-gray-400">Online</span>
                  </div>
                </div>
              )}
              {/* Profile Information group chat */}
              {chat?.type === 'GROUP' && (
                <>
                  <div className="flex flex-col items-center justify-between p-2">
                    <div className="relative">
                      <img
                        src={grpImgPreview || 'https://via.placeholder.com/150'}
                        alt="Profile Avatar"
                        className="h-20 w-20 rounded-full border-2 border-gray-300"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="absolute bottom-0 right-0"
                      >
                        <div className="cursor-pointer rounded-full bg-blue-500 p-2">
                          <TiCamera className="text-white" size={12} />
                        </div>
                      </label>
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    <button
                      type="button"
                      className="mt-2 w-max rounded-sm bg-blue-500 px-2.5 py-1 text-center text-xs text-white disabled:bg-blue-300"
                      onClick={handleUpdateProfilePicture}
                      disabled={!groupImg}
                    >
                      Edit Image
                    </button>
                  </div>
                  <h2 className="text-base font-semibold">{chat.group_name}</h2>
                  <p className="mt-1 text-xs font-normal">Members</p>
                  <div className="mt-4 flex w-full flex-col items-start gap-2">
                    {sortedParticipants &&
                      sortedParticipants.length > 0 &&
                      sortedParticipants
                        .slice(0, showMore ? sortedParticipants.length : 5)
                        .map((participant) => (
                          <div
                            key={participant?.id}
                            className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 p-2 hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  participant?.image ||
                                  'https://i.pravatar.cc/106'
                                }
                                alt={participant?.name}
                                className="h-8 w-8 rounded-full border border-gray-300"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'https://i.pravatar.cc/106';
                                }}
                              />
                              <div className="flex flex-col overflow-hidden">
                                <h3
                                  className="truncate text-sm font-medium"
                                  title={participant?.name}
                                >
                                  {participant?.name}
                                </h3>
                                <p
                                  className="truncate text-xs text-gray-500"
                                  title={participant?.email}
                                >
                                  {participant?.email}
                                </p>
                              </div>
                            </div>
                            {participant?.id === currentUser?.id && (
                              <span className="rounded-sm border border-gray-300 px-1 py-0.5 text-xs text-gray-500">
                                You
                              </span>
                            )}
                          </div>
                        ))}
                  </div>
                  {sortedParticipants &&
                    sortedParticipants.length > 5 &&
                    !showMore && (
                      <button
                        className="mt-2 w-full rounded-md border border-slate-300 bg-gray-200 py-2.5 text-center text-xs text-gray-500"
                        onClick={() => setShowMore(true)}
                      >
                        View More Participants
                      </button>
                    )}
                  {showMore && (
                    <button
                      className="mt-2 w-full rounded-md border border-slate-300 bg-gray-200 py-2.5 text-center text-xs text-gray-800"
                      onClick={() => setShowMore(false)}
                    >
                      View Less Participants
                    </button>
                  )}
                  <button
                    type="button"
                    className="mt-2 w-full rounded-sm bg-blue-500 py-2.5 text-center text-xs text-white"
                    onClick={() => {
                      leaveConversation(chat?.id, () => {});
                      setOpen(false);
                      resetChatDetails();
                    }}
                  >
                    Leave Group
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDrawer;
