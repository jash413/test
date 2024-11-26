'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FiSearch, FiPlus, FiDownload } from 'react-icons/fi';
import {
  VscSend,
  VscChromeClose,
  VscReactions,
  VscReply
} from 'react-icons/vsc';
import { BiCheckDouble } from 'react-icons/bi';
import { TiCamera, TiGroup, TiUser } from 'react-icons/ti';
import { IoChevronBackOutline } from 'react-icons/io5';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FaHistory, FaUsers, FaRegImage, FaDownload } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import socket, {
  addReaction,
  addSocketListener,
  createConversation,
  deleteConversation,
  deleteMessage,
  deleteReaction,
  editMessage,
  getConversation,
  getConversations,
  getConversationsWithUnreadCounts,
  getMessages,
  getNewMessage,
  getUnreadCount,
  initiateSocketConnection,
  joinConversation,
  markMessagesAsRead,
  messageDeleted,
  messageReadUpdate,
  newConversation,
  reactionAdded,
  reactionDeleted,
  sendMessage,
  setUserStoppedTyping,
  setUserTyping
} from '@/lib/socket';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import morevert_hori from '@/public/assets/morevert_horizontal.svg';
import dynamic from 'next/dynamic';
import { Conversation, IMessages, InFileInfo } from './types';
import ChatList from './ChatList';
import { format } from 'date-fns';
import axios from 'axios';
import ProfileDrawer from './ProfileDrawer';
import { Oval } from 'react-loader-spinner';
import no_chat from '@/public/assets/no_chat.svg';

const EmojiPicker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

const ChatBox = ({
  token,
  userDetails
}: {
  token: string;
  userDetails: any;
}) => {
  const [conversationList, setConversationList] = useState<Conversation[] | []>(
    []
  );
  const [msgContainerHeight, setMsgContainerHeight] = useState('650px');
  const ImageContainerRef = useRef<HTMLDivElement>(null);
  const ReplyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // const handleNewMessage = (res) => {
    //     console.log('New message received:', res);

    // };

    // Initiate socket connection
    initiateSocketConnection(token);

    // Call the fetchConversations async function
    // fetchConversations();

    getConversations((response) => {
      // alert(response);
      // console.log(response, "getConversations");
      setConversationList(response.data);
    });

    getUnreadCount(userDetails?.id, (res) => {
      // alert(res)
      // console.log(res, "unreadCount");
    });
    // joinConversation(434)

    // sendMessage("Hi gaurang", 434)

    // createConversation('GROUP', [274, 59, 83], (response) => {
    //     alert(response);
    //     console.log(, "createConversation");
    // });

    // joinConversation(437);

    // sendMessage("Hello from jj", 437);

    // getConversations((data) => {
    //     // alert(data);
    //     console.log(data, "jjjj");
    // });

    // join

    // Optionally, handle socket disconnection on cleanup
    // return () => {
    //     socket.disconnect();
    // };
  }, [token, userDetails]);

  const [hoveredReaction, setHoveredReaction] = useState<number | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState<Conversation | null>(
    null
  );
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMsgOptOpen, setIsMsgOptOpen] = useState(false);
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [selectedImages, setSelectedImages] = useState<
    (File | { buffer: Buffer; originalname: string })[]
  >([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'groups'>('recent');
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [msgOptId, setMsgOptId] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editMessageId, setEditMessageId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [activeEmojiPickerId, setActiveEmojiPickerId] = useState<number | null>(
    null
  );
  const [openNewChatModal, setOpenNewChatModal] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [fetchUserLoading, setFetchUserLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupImg, setGroupImg] = useState<
    | {
        buffer: Buffer;
        originalname: string;
      }
    | File
    | null
  >(null);
  const [grpImgPreview, setGrpImgPreview] = useState<string | null>(
    'https://via.placeholder.com/150'
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState<IMessages | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setUserTyping(selectedChat as number, (res) => {});

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        setUserStoppedTyping(selectedChat as number, (res) => {});
      }, 1000)
    );
  };

  const filteredConversations = conversationList.filter((chat) => {
    if (chat.type === 'ONE_TO_ONE') {
      const participant = chat?.participants?.find(
        (participant) => participant?.id !== userDetails?.id
      );
      return participant?.name
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase());
    }
    if (chat.type === 'GROUP') {
      return chat?.group_name
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase());
    }
    return false;
  });

  const clearSearch = () => setSearchQuery('');

  const handleReactionClick = (id: number) => {
    setActiveEmojiPickerId((prevId) => (prevId === id ? null : id));
  };

  const messageEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Properly type the messageId parameter
  const scrollToMessage = (messageId: string | number) => {
    const messageElement = messageRefs.current[messageId.toString()];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // const handleSend = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (isEdit) {
  //         editMessage(selectedChat as number, editMessageId as unknown as number, input);
  //         setIsEmojiPickerOpen(false);
  //         setEditMessageId(null);
  //         setIsEdit(false);
  //         setInput("");
  //     } else {
  //         if (input.trim() === "" && selectedImages.length === 0) return;

  //         const newMessages: { id: number; text: string; sender: string; time: string; }[] = [];

  //         if (input.trim() !== "") {
  //             newMessages.push({
  //                 id: messages.length + 1,
  //                 text: input.trim(),
  //                 sender: "you",
  //                 time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  //             });
  //         }

  //         // const imageMessages = selectedImages.map((image, index) => ({
  //         //     id: messages.length + 1 + newMessages.length + index,
  //         //     text: "",
  //         //     sender: "you",
  //         //     time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  //         //     image: URL.createObjectURL(image),
  //         // }));

  //         setMessages((prevMessages) => [...(prevMessages as any), ...newMessages]);

  //         setInput("");
  //         setSelectedImages([]);

  //         if (input.trim() !== "") {
  //             sendMessage(selectedChat as number, input.trim(), undefined);
  //         }
  //         if (selectedImages.length > 0) {
  //             sendMessage(selectedChat as number, undefined, selectedImages);
  //         }

  //         setIsEmojiPickerOpen(false);

  //         // getConversations((response) => {
  //         //     // alert(response)
  //         //     setConversationList(response.data)
  //         // });
  //     }
  // };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      editMessage(
        selectedChat as number,
        editMessageId as unknown as number,
        input,
        (res) => {}
      );
      setIsEmojiPickerOpen(false);
      setEditMessageId(null);
      setIsEdit(false);
      setInput('');
    } else {
      if (input.trim() === '' && selectedImages.length === 0) return;

      const newMessages: IMessages[] = [];
      const tempId =
        messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;

      // Handling text input
      if (input.trim() !== '') {
        newMessages.push({
          id: tempId,
          creator_id: userDetails?.id,
          updater_id: userDetails?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          active: true,
          content: input.trim(),
          sender_id: userDetails?.id,
          conversation_id: selectedChat as number,
          file_info: '',
          reactions: null,
          pinned: false,
          parent_message_id: replyMessage?.id as number,
          message_type: 'text',
          sender: {
            id: userDetails?.id,
            name: userDetails?.name,
            email: userDetails?.email
          },
          image: null
        });
      }

      // Handling selected images
      if (selectedImages.length > 0) {
        selectedImages.forEach((image, index) => {
          newMessages.push({
            id: tempId,
            creator_id: userDetails?.id,
            updater_id: userDetails?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            active: true,
            content: '',
            sender_id: userDetails?.id,
            conversation_id: selectedChat as number,
            file_info:
              'originalname' in image ? image.originalname : image.name,
            reactions: null,
            pinned: false,
            parent_message_id: replyMessage?.id as number,
            message_type: 'image',
            sender: {
              id: userDetails?.id,
              name: userDetails?.name,
              email: userDetails?.email
            },
            image: image
          });
        });
      }

      // Update local state
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);

      // Reset input fields
      setInput('');
      setSelectedImages([]);

      // Sync with socket.io
      if (input.trim() !== '') {
        sendMessage(
          selectedChat as number,
          replyMessage?.id as number,
          input.trim(),
          undefined,
          (res) => {
            if (res?.data) {
              setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.id === tempId ? res.data : msg))
              );
            }
          }
        );
      }
      if (selectedImages.length > 0) {
        sendMessage(
          selectedChat as number,
          replyMessage?.id as number,
          '',
          selectedImages,
          (res) => {
            // setMessages((prevMessages) => [
            //     ...prevMessages,
            //     ...(Array.isArray(res?.data) ? res.data : [res?.data]),
            // ]);
            if (res?.data) {
              setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.id === tempId ? res.data : msg))
              );
            }
          }
        );
      }
      setReplyMessage(null);
      setIsEmojiPickerOpen(false);
    }
  };

  // Helper function to read the file and return a buffer
  const fileToBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Process each file and convert it to buffer
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const buffer = await fileToBuffer(file);
          return {
            buffer: Buffer.from(buffer),
            originalname: file.name
          };
        })
      );

      setSelectedImages((prevFiles) => [...prevFiles, ...processedFiles]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleChatSelect = (chat: Conversation) => {
    setSelectedChat(chat.id);
    setIsDrawerOpen(false);
    setCurrentChatUser(chat);
  };

  const toggleUserSelection = (userId: number) => {
    if (isGroupMode) {
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      } else {
        setSelectedUsers([...selectedUsers, userId]);
      }
    } else {
      setSelectedUsers([userId]);
    }
  };

  const handleCreateGroupClick = () => {
    setIsGroupMode((prev) => !prev);
    setSelectedUsers([]);
    setGroupName('');
  };

  const handleCreateNewChat = () => {
    if (selectedUsers.length > 0 && isGroupMode) {
      createConversation(
        'GROUP',
        [userDetails?.id, ...selectedUsers],
        groupName,
        groupImg || undefined,
        (response) => {
          // alert(response);
        }
      );
    } else {
      createConversation(
        'ONE_TO_ONE',
        [userDetails?.id, ...selectedUsers],
        undefined,
        undefined,
        (response) => {
          // alert(response);
        }
      );
    }
    setOpenNewChatModal(false);
    setGroupName('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // const reader = new FileReader();

      // // Create a preview of the image
      setGrpImgPreview(URL.createObjectURL(file));

      // // Read the file as an ArrayBuffer to store it in state
      // reader.readAsArrayBuffer(file);
      // reader.onloadend = () => {
      //     const buffer = Buffer.from(reader.result as ArrayBuffer);
      //     setGroupImg({
      //         buffer,
      //         originalname: file.name,
      //     });
      // };
      setGroupImg(file as File);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = '';
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const safeParseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return jsonString; // Return the string itself if it's not valid JSON
    }
  };

  const resetChatDetails = () => {
    setSelectedChat(null);
    setCurrentChatUser(null);
  };

  useEffect(() => {
    const formHeight = ImageContainerRef.current
      ? (ImageContainerRef.current as HTMLDivElement).offsetHeight
      : 0;

    const newHeight = `calc(650px - ${formHeight}px)`;
    setMsgContainerHeight(newHeight);
  }, [selectedImages, openImagePreview]);

  useEffect(() => {
    const replyHeight = ReplyContainerRef.current
      ? (ReplyContainerRef.current as HTMLDivElement).offsetHeight
      : 0;
    const newHeight = `calc(650px - ${replyHeight}px)`;
    setMsgContainerHeight(newHeight);
  }, [replyMessage]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      markMessagesAsRead(selectedChat as number, (res) => {});
    }
  }, [messages.length]);

  useEffect(() => {
    if (selectedImages.length > 0) {
      setOpenImagePreview(true);
    } else {
      setOpenImagePreview(false);
    }
  }, [selectedImages]);

  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat, (res) => {
        setMessages(res?.data.slice().reverse());
      });
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      joinConversation(selectedChat, () => {});
    }
  }, [selectedChat]);

  useEffect(() => {
    addSocketListener('newMessage', (res) => {
      // console.log('New message received:', res);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !(emojiPickerRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setActiveEmojiPickerId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setFetchUserLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/zen/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data.status === 200) {
          setUsersList(response?.data?.body?.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setFetchUserLoading(false);
      }
    };

    if (openNewChatModal) {
      fetchData();
    }
  }, [openNewChatModal]);

  useEffect(() => {
    getNewMessage((res) => {
      // console.log(res, "messages");
      // setMessages([...messages, message]);
    });
  }, [messages]);

  useEffect(() => {
    messageReadUpdate((res) => {
      // console.log(res, "messageReadUpdate");
      // setMessages([...messages, message]);
    });
  }, [messages]);

  useEffect(() => {
    newConversation((res) => {
      setConversationList((prev) => [{ ...res, messages: [] }, ...prev]);
    });
  }, []);

  useEffect(() => {
    reactionAdded((res) => {
      // console.log(res, "reactionAdded");
    });
  }, []);

  useEffect(() => {
    reactionDeleted((res) => {
      // console.log(res, "reactionDeleted");
    });
  }, []);

  useEffect(() => {
    getConversationsWithUnreadCounts((res) => {
      // console.log(res, "getConversationsWithUnreadCounts");
    });
  }, []);

  return (
    <div
      className="mx-auto flex w-full"
      // style={{ height: dynamicHeight }}
    >
      <div className="mx-auto flex h-full max-h-[800px] min-h-[800px] w-full items-start justify-center rounded-lg border border-gray-300 bg-white shadow-lg">
        {/* Chat List Section */}
        <div
          className={cn(
            'flex h-full w-1/4 min-w-80 flex-col items-start justify-between bg-white',
            selectedChat ? 'hidden lg:block' : 'block w-full lg:w-1/4',
            isDrawerOpen && 'lg:!block'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <div
              title="Start new chat"
              onClick={() => {
                setOpenNewChatModal((prev) => !prev);
                setSelectedUsers([]);
                setIsGroupMode(false);
                setGroupName('');
              }}
              className={cn(
                'cursor-pointer rounded-full bg-gray-100 p-2',
                openNewChatModal && 'rotate-45'
              )}
            >
              <FiPlus className="hover:scale-125" />
            </div>
          </div>

          {/* Search Bar */}
          {!openNewChatModal && (
            <div className="p-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Chat"
                  className="w-full rounded-lg bg-gray-100 p-2 pl-3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery ? (
                  <span
                    className="absolute right-3 top-2.5 h-5 w-5 cursor-pointer text-gray-400"
                    onClick={clearSearch}
                  >
                    <VscChromeClose />
                  </span>
                ) : (
                  <span className="absolute right-3 top-2.5 h-5 w-5 text-gray-400">
                    <FiSearch />
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          {!openNewChatModal && (
            <div className="flex justify-around border-b border-gray-300 bg-gray-100">
              <button
                onClick={() => setActiveTab('recent')}
                className={cn(
                  'flex w-full items-center justify-center border-b-2 p-2 text-sm transition-all duration-300',
                  activeTab === 'recent'
                    ? 'border-blue-600 bg-blue-200 font-semibold text-blue-600'
                    : 'text-gray-600'
                )}
              >
                <span
                  className={cn(
                    'mr-2 rounded-full bg-gray-200 p-1.5',
                    activeTab === 'recent' && 'bg-blue-300'
                  )}
                >
                  <FaHistory />
                </span>
                Recent
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={cn(
                  'flex w-full items-center justify-center border-b-2 border-gray-300 p-2 text-sm transition-all duration-300',
                  activeTab === 'groups'
                    ? 'border-blue-600 bg-blue-200 font-semibold text-blue-600'
                    : 'text-gray-600'
                )}
              >
                <span
                  className={cn(
                    'mr-2 rounded-full bg-gray-200 p-1.5',
                    activeTab === 'groups' && 'bg-blue-300'
                  )}
                >
                  <FaUsers />
                </span>
                Groups
              </button>
            </div>
          )}

          {/* Create Group Modal */}
          {openNewChatModal && (
            <div className="flex flex-col">
              <span
                onClick={handleCreateGroupClick}
                className="mx-2 my-1.5 flex cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-gray-100 px-2 py-2"
              >
                {isGroupMode ? <TiGroup /> : <TiUser />}
                <p className="text-sm font-semibold text-gray-600">
                  {isGroupMode
                    ? 'Create a new group'
                    : 'Create one to one chat'}
                </p>
              </span>
              {isGroupMode && (
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
                  </div>
                  <div className="p-2">
                    <Input
                      placeholder="Enter group name..."
                      type="text"
                      value={groupName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.trim() !== '' || value === '') {
                          setGroupName(value);
                        }
                      }}
                      className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab Content with Scrollable Area */}
          {!openNewChatModal ? (
            <div className="relative h-max overflow-hidden bg-white">
              <div
                className={cn(
                  'flex h-max'
                  // activeTab === "recent" ? "translate-x-0" : "-translate-x-[50%]"
                )}
                // style={{ width: "200%" }}
              >
                {/* Recent Chats */}
                {activeTab === 'recent' && (
                  <div className="scrollbar-thumb-rounded-full h-full w-full overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
                    <h2 className="text-sm text-gray-600">Active Chats</h2>
                    <div className="mt-4 max-h-[550px] space-y-1">
                      {filteredConversations &&
                        filteredConversations
                          .filter((convo) => convo.type === 'ONE_TO_ONE')
                          .map((chat, i) => (
                            <ChatList
                              key={i}
                              currentChat={currentChatUser}
                              chat={chat}
                              userDetails={userDetails}
                              onClickHandle={handleChatSelect}
                            />
                          ))}
                    </div>
                  </div>
                )}

                {/* Groups */}
                {activeTab === 'groups' && (
                  <div className="scrollbar-thumb-rounded-full h-full w-full overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
                    <h2 className="text-sm text-gray-600">Groups</h2>
                    <div className="mt-4 max-h-[550px] space-y-1">
                      {filteredConversations &&
                        filteredConversations
                          .filter((convo) => convo.type === 'GROUP')
                          .map((chat, i) => (
                            <ChatList
                              key={i}
                              currentChat={currentChatUser}
                              chat={chat}
                              userDetails={userDetails}
                              onClickHandle={handleChatSelect}
                            />
                          ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={cn('relative overflow-hidden bg-white')}>
              <div className={cn('flex h-full')}>
                <div
                  className={cn(
                    'scrollbar-thumb-rounded-full h-full w-full overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200',
                    isGroupMode ? 'max-h-[500px]' : 'max-h-[650px]'
                  )}
                >
                  <div className="mt-2 h-full">
                    {!fetchUserLoading ? (
                      usersList.map((user, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex cursor-pointer items-center border-t border-gray-300 px-1.5 py-2',
                            selectedUsers.includes(user.id) ? 'bg-blue-100' : ''
                          )}
                          onClick={() => toggleUserSelection(user.id)}
                        >
                          <div className="relative w-max">
                            <img
                              src={'https://i.pravatar.cc/300'}
                              alt="User Avatar"
                              className="relative h-10 w-10 rounded-full"
                            />
                          </div>
                          <div className="ml-2 flex-1">
                            <h3 className="text-sm font-semibold">
                              {user?.attributes?.name ?? 'User'}
                            </h3>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Oval
                          visible={true}
                          height="40"
                          width="40"
                          color="#3872ed"
                          secondaryColor="#bfdbfe"
                          ariaLabel="oval-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {selectedUsers.length > 0 && (
                <div className="absolute bottom-4 right-8 z-10">
                  <button
                    title={
                      isGroupMode && !groupName
                        ? 'Please write group name'
                        : undefined
                    }
                    disabled={isGroupMode && !groupName}
                    onClick={() => handleCreateNewChat()}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {isGroupMode ? (
                      <AiOutlineUsergroupAdd size={24} />
                    ) : (
                      <AiOutlineUserAdd size={24} />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages Section */}
        <div
          className={cn(
            'flex h-full w-3/4 flex-col items-stretch justify-between border-x border-gray-300 bg-white',
            isDrawerOpen
              ? '!hidden w-full lg:!flex lg:w-3/4'
              : 'w-full lg:w-3/4',
            selectedChat ? 'block min-w-80' : 'hidden lg:block'
          )}
        >
          <div
            className={cn(
              'flex h-max items-center justify-between border-b border-gray-300 bg-white p-4 shadow',
              !currentChatUser && 'invisible'
            )}
          >
            <div className="flex gap-2">
              <span
                onClick={() => setSelectedChat(null)}
                className="flex items-center justify-center text-xl font-semibold lg:!hidden"
              >
                <IoChevronBackOutline size={30} />
              </span>
              <div className="relative w-max">
                <img
                  src={'https://i.pravatar.cc/300'}
                  alt="User Avatar"
                  className="relative h-10 w-10 rounded-full"
                />
                {/* Status Dot */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 outline outline-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold capitalize">
                  {currentChatUser?.type === 'ONE_TO_ONE'
                    ? currentChatUser.participants.find(
                        (participant) => participant.id !== userDetails?.id
                      )?.name
                    : currentChatUser?.group_name}
                </h1>
                <p className="text-xs text-gray-500">online</p>
              </div>
            </div>
            <div className="flex w-fit gap-2">
              {!isDrawerOpen && (
                <Popover open={isMsgOptOpen}>
                  <PopoverTrigger asChild>
                    <button
                      onClick={() => setIsMsgOptOpen((prev) => !prev)}
                      className=" flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 "
                    >
                      <img
                        src={morevert_hori.src}
                        alt=""
                        className=" h-5 w-5 rotate-90"
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit p-2">
                    <div className="flex min-w-32 flex-col gap-1">
                      <button
                        className=" rounded-sm px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                        onClick={() => {
                          setIsDrawerOpen(true);
                          setIsMsgOptOpen(false);
                        }}
                      >
                        {currentChatUser?.type === 'ONE_TO_ONE'
                          ? 'View profile'
                          : 'Group info'}
                      </button>
                      <button
                        className=" rounded-sm px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 hover:text-red-700"
                        onClick={() => {
                          deleteConversation(selectedChat as number, () => {});
                          setSelectedChat(null);
                          setCurrentChatUser(null);
                          setIsMsgOptOpen(false);
                        }}
                      >
                        Clear chat
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          {/* this height should set dynamicly based on available size vh */}
          <div
            style={{ maxHeight: msgContainerHeight }}
            className={cn(
              'scrollbar-thumb-rounded-full h-full min-h-[650px] flex-1 space-y-4 overflow-y-auto bg-white p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200',
              !currentChatUser && 'border-t border-gray-300',
              openImagePreview || messageEndRef ? 'min-h-0' : 'max-h-[650px]'
            )}
          >
            {currentChatUser ? (
              <div className="flex h-full w-full flex-col items-center justify-between">
                <div className="relative flex h-full w-full flex-col gap-2">
                  {messages?.map((message: IMessages, idx) => {
                    const currentDate = message?.created_at
                      ? new Date(message.created_at)
                      : null;
                    const previousDate = messages[idx - 1]?.created_at
                      ? new Date(messages[idx - 1].created_at)
                      : null;

                    const showDateHeader =
                      idx === 0 ||
                      (currentDate &&
                        previousDate &&
                        format(currentDate, 'PPP') !==
                          format(previousDate, 'PPP'));
                    const parentMessage = message.parent_message_id
                      ? messages.find((m) => m.id === message.parent_message_id)
                      : null;

                    const hasNextMessageReactions =
                      messages?.length > 0 &&
                      (messages[idx]?.reactions?.length ?? 0) > 0;

                    return (
                      <div
                        key={message.id}
                        ref={idx === messages.length - 1 ? messageEndRef : null}
                      >
                        {showDateHeader && (
                          <div className="sticky top-0 z-10 rounded-lg bg-gray-100 p-2 text-center text-sm font-medium text-gray-500">
                            {currentDate ? format(currentDate, 'PPP') : '-'}
                          </div>
                        )}
                        <div
                          key={message.id}
                          ref={(el) => (messageRefs.current[message.id] = el)}
                          className={cn(
                            'flex',
                            message?.sender?.id === userDetails?.id
                              ? 'justify-end'
                              : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'flex gap-2',
                              message?.sender?.id === userDetails?.id
                                ? 'flex-row-reverse'
                                : ''
                            )}
                          >
                            <div className="relative h-max w-max">
                              <img
                                src={'https://i.pravatar.cc/300'}
                                alt="User Avatar"
                                className="relative h-10 w-10 rounded-full"
                              />
                              {/* Status Dot */}
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 outline outline-white" />
                            </div>
                            <div
                              className={cn(
                                'group flex flex-col gap-1',
                                hasNextMessageReactions && 'mb-3'
                              )}
                            >
                              <div
                                className={cn(
                                  'flex gap-2',
                                  message?.sender?.id === userDetails?.id &&
                                    'flex-row-reverse items-end'
                                )}
                              >
                                <span className="text-xs text-gray-400">
                                  {message?.created_at
                                    ? format(
                                        new Date(message?.created_at),
                                        'h:mm a'
                                      )
                                    : '-'}
                                </span>
                                <span className="text-xs font-semibold text-black">
                                  {message?.sender?.id === userDetails?.id
                                    ? 'you'
                                    : message?.sender?.name}
                                </span>
                                {message?.sender?.id === userDetails?.id && (
                                  <span>
                                    <BiCheckDouble />
                                  </span>
                                )}
                              </div>
                              <div
                                className={cn(
                                  'relative flex items-center gap-1.5',
                                  message?.sender?.id === userDetails?.id
                                    ? 'justify-end'
                                    : 'justify-start'
                                )}
                              >
                                {message?.sender?.id === userDetails?.id && (
                                  <Popover
                                    open={
                                      isPopoverOpen &&
                                      message?.id ===
                                        (msgOptId as unknown as number)
                                    }
                                  >
                                    <PopoverTrigger asChild>
                                      <button
                                        onClick={() => {
                                          setMsgOptId(message?.id);
                                          setIsPopoverOpen((prev) => !prev);
                                        }}
                                        className="flex items-center justify-center"
                                      >
                                        <img
                                          src={morevert_hori.src}
                                          alt=""
                                          className=" h-5 w-5 rotate-90"
                                        />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-fit p-2"
                                      side="left"
                                      align="start"
                                    >
                                      <div className="flex min-w-20 flex-col gap-1">
                                        <button
                                          className="rounded-sm px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                          onClick={() => {
                                            setReplyMessage(message);
                                            setIsPopoverOpen(false);
                                          }}
                                        >
                                          Reply
                                        </button>
                                        {!(Array.isArray(message?.file_info)
                                          ? JSON.parse(message?.file_info)
                                              .length > 0
                                          : message?.file_info.length > 5) && (
                                          <button
                                            className="rounded-sm px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                            onClick={() => {
                                              setIsEdit(true);
                                              setEditMessageId(message?.id);
                                              setInput(message?.content);
                                              setIsPopoverOpen(false);
                                            }}
                                          >
                                            Edit
                                          </button>
                                        )}
                                        <button
                                          className="rounded-sm px-2 py-1 text-left text-sm text-red-500 hover:bg-gray-100 hover:text-red-700"
                                          onClick={() => {
                                            deleteMessage(
                                              message?.conversation_id,
                                              message?.id,
                                              (res) => {}
                                            );
                                            setIsPopoverOpen(false);
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                )}
                                <div
                                  className={cn(
                                    'relative max-w-xs rounded-lg p-2 text-white',
                                    message?.sender?.id === userDetails?.id
                                      ? 'bg-blue-600'
                                      : 'bg-gray-300'
                                  )}
                                >
                                  {parentMessage && (
                                    <div
                                      onClick={() =>
                                        scrollToMessage(
                                          message?.parent_message_id as number
                                        )
                                      }
                                      className={cn(
                                        'cursor-pointer rounded-sm bg-slate-300 p-2 text-gray-900',
                                        message.sender.id === userDetails?.id
                                          ? 'bg-blue-200'
                                          : 'bg-gray-200'
                                      )}
                                    >
                                      <div className="flex w-full items-center justify-between">
                                        <VscReply />
                                      </div>
                                      <div className="items start flex flex-col justify-center gap-2.5">
                                        <span className="text-xs italic">
                                          {parentMessage?.content ||
                                            (() => {
                                              if (parentMessage?.file_info) {
                                                try {
                                                  const fileInfo = JSON.parse(
                                                    parentMessage.file_info
                                                  );
                                                  return Array.isArray(
                                                    fileInfo
                                                  ) && fileInfo.length > 0
                                                    ? fileInfo[0]
                                                        ?.original_name ||
                                                        'file'
                                                    : null;
                                                } catch {
                                                  return null;
                                                }
                                              }
                                              return null;
                                            })()}
                                        </span>
                                        <p className="text-xs font-normal">
                                          {parentMessage?.sender?.name},{' '}
                                          {format(
                                            new Date(parentMessage?.created_at),
                                            'dd/MM/yyyy h:mm a'
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {message?.content !== '' && (
                                    <p className="text-sm">
                                      {message?.content}
                                    </p>
                                  )}

                                  {message?.file_info &&
                                    (Array.isArray(
                                      safeParseJSON(message.file_info)
                                    )
                                      ? safeParseJSON(message.file_info)
                                      : [{ original_name: message.file_info }]
                                    ).map((file: InFileInfo, index: number) => {
                                      const isImage = file.original_name.match(
                                        /\.(jpeg|jpg|gif|png|jfif|webp)$/i
                                      );

                                      return (
                                        <div
                                          key={index}
                                          className="flex w-44 flex-col items-center justify-between gap-2.5 rounded-lg border bg-gray-50 p-4"
                                        >
                                          {isImage ? (
                                            <img
                                              src={file?.download_url}
                                              alt={file?.original_name}
                                              className="h-auto w-full rounded"
                                            />
                                          ) : (
                                            <button
                                              onClick={() =>
                                                handleDownload(
                                                  file.download_url
                                                )
                                              }
                                              className="flex items-center rounded-full bg-slate-300 p-2 text-gray-500"
                                            >
                                              <FiDownload />
                                            </button>
                                          )}

                                          <span
                                            className="w-full truncate text-sm text-black"
                                            title={file.original_name}
                                          >
                                            {file.original_name}
                                          </span>
                                        </div>
                                      );
                                    })}

                                  {/* Render Reactions */}
                                  {message.reactions && (
                                    <div
                                      className={cn(
                                        'absolute -bottom-4 left-3 flex items-center rounded-full border bg-white px-0.5',
                                        message.id === hoveredReaction &&
                                          'scrollbar-thumb-rounded-full max-h-20 flex-col items-start justify-start overflow-y-auto rounded-md bg-gray-700 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200',
                                        safeParseJSON(message.reactions)
                                          .length <= 0 && 'hidden'
                                      )}
                                    >
                                      {Array.isArray(
                                        safeParseJSON(message.reactions)
                                      ) &&
                                        safeParseJSON(message.reactions).map(
                                          (
                                            reaction: {
                                              userId: number;
                                              reaction: string;
                                            },
                                            index: number
                                          ) => (
                                            <div
                                              key={index}
                                              className="relative flex items-center"
                                              onMouseEnter={() =>
                                                setHoveredReaction(
                                                  message.id as number
                                                )
                                              }
                                              onMouseLeave={() =>
                                                setHoveredReaction(null)
                                              }
                                            >
                                              {message.id !==
                                                hoveredReaction && (
                                                <span className="text-lg">
                                                  {reaction.reaction}
                                                </span>
                                              )}
                                              {message.id ===
                                                hoveredReaction && (
                                                <button
                                                  type="button"
                                                  title={
                                                    reaction.userId ===
                                                    userDetails.id
                                                      ? 'Click to remove'
                                                      : `Reaction by ${currentChatUser?.participants.find(
                                                          (participant) =>
                                                            participant.id ===
                                                            reaction.userId
                                                        )?.name}`
                                                  }
                                                  onClick={() => {
                                                    setMessages(
                                                      (prevMessages) =>
                                                        prevMessages.map(
                                                          (msg) =>
                                                            msg.id ===
                                                            message.id
                                                              ? {
                                                                  ...msg,
                                                                  reactions:
                                                                    null
                                                                }
                                                              : msg
                                                        )
                                                    );
                                                    deleteReaction(
                                                      selectedChat as number,
                                                      message.id,
                                                      reaction.reaction,
                                                      (res) => {
                                                        if (res.success) {
                                                          setMessages(
                                                            (prevMessages) =>
                                                              prevMessages.map(
                                                                (msg) =>
                                                                  msg.id ===
                                                                  message.id
                                                                    ? res?.data
                                                                        ?.updatedMessage
                                                                    : msg
                                                              )
                                                          );
                                                        }
                                                      }
                                                    );
                                                  }}
                                                  disabled={
                                                    reaction.userId !==
                                                    userDetails.id
                                                  }
                                                  className="z-10 w-full max-w-40 truncate whitespace-nowrap rounded-md p-1 text-xs text-white"
                                                >
                                                  {reaction.userId ===
                                                  userDetails.id
                                                    ? `${reaction.reaction} you`
                                                    : `${
                                                        reaction.reaction
                                                      } ${currentChatUser?.participants.find(
                                                        (participant) =>
                                                          participant.id ===
                                                          reaction.userId
                                                      )?.name}`}
                                                </button>
                                              )}
                                            </div>
                                          )
                                        )}
                                    </div>
                                  )}

                                  {activeEmojiPickerId === message.id && (
                                    <span
                                      ref={emojiPickerRef}
                                      className="absolute left-1/4 top-1/2 z-50"
                                    >
                                      <EmojiPicker
                                        open={
                                          activeEmojiPickerId === message.id
                                        }
                                        onEmojiClick={(emojiObject) => {
                                          setMessages((prevMessages) =>
                                            prevMessages.map((msg) =>
                                              msg.id === message.id
                                                ? {
                                                    ...msg,
                                                    reactions: JSON.stringify([
                                                      {
                                                        userId: userDetails?.id,
                                                        reaction:
                                                          emojiObject.emoji
                                                      }
                                                    ])
                                                  }
                                                : msg
                                            )
                                          );
                                          addReaction(
                                            message?.conversation_id,
                                            message?.id,
                                            emojiObject.emoji,
                                            (res) => {
                                              if (!res.success) {
                                                setMessages((prevMessages) =>
                                                  prevMessages.map((msg) =>
                                                    msg.id === message.id
                                                      ? {
                                                          ...msg,
                                                          reactions: null
                                                        }
                                                      : msg
                                                  )
                                                );
                                              }
                                            }
                                          );
                                          setActiveEmojiPickerId(null);
                                        }}
                                      />
                                    </span>
                                  )}
                                </div>
                                {message?.sender?.id !== userDetails?.id && (
                                  <div className="flex gap-0.5">
                                    <span className="">
                                      <VscReactions
                                        size={20}
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleReactionClick(message.id)
                                        }
                                      />
                                    </span>
                                    <Popover
                                      open={
                                        isPopoverOpen &&
                                        message?.id ===
                                          (msgOptId as unknown as number)
                                      }
                                    >
                                      <PopoverTrigger asChild>
                                        <button
                                          onClick={() => {
                                            setMsgOptId(message?.id);
                                            setIsPopoverOpen((prev) => !prev);
                                          }}
                                          className="flex items-center justify-center"
                                        >
                                          <img
                                            src={morevert_hori.src}
                                            alt=""
                                            className=" h-5 w-5 rotate-90"
                                          />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-fit p-2"
                                        side="right"
                                        align="start"
                                      >
                                        <div className="flex min-w-20 flex-col gap-1">
                                          <button
                                            className="rounded-sm px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                            onClick={() => {
                                              setReplyMessage(message);
                                              setIsPopoverOpen(false);
                                            }}
                                          >
                                            Reply
                                          </button>
                                          <button
                                            className="rounded-sm px-2 py-1 text-left text-sm text-red-500 hover:bg-gray-100 hover:text-red-700"
                                            onClick={() => {
                                              deleteMessage(
                                                message?.conversation_id,
                                                message?.id,
                                                (res) => {}
                                              );
                                              setIsPopoverOpen(false);
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={no_chat.src}
                  alt="no chat"
                  className="h-60 w-60 object-cover"
                />
              </div>
            )}
          </div>
          <form
            onSubmit={handleSend}
            className={cn('flex flex-col', !currentChatUser && 'invisible')}
          >
            <div ref={ImageContainerRef}>
              {openImagePreview && (
                <div className="flex w-full items-start justify-start gap-2 rounded-t-lg border-t border-gray-300 px-2 pt-2">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                        <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-1.5 text-xs text-gray-500">
                          {'originalname' in file
                            ? file.originalname
                            : file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        type="button"
                        className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
                      >
                        <VscChromeClose />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div ref={ReplyContainerRef}>
              {replyMessage && (
                <div className="mb-2 flex w-full flex-col items-start justify-between gap-2 rounded-t-lg border-t border-gray-300 px-2 pt-2">
                  <div className="flex w-full items-center justify-between">
                    <VscReply />
                    <button type="button" onClick={() => setReplyMessage(null)}>
                      <VscChromeClose />
                    </button>
                  </div>
                  <div className="items start flex flex-col justify-center gap-2.5">
                    <span>
                      {replyMessage.content ||
                        (() => {
                          if (replyMessage.file_info) {
                            try {
                              const fileInfo = JSON.parse(
                                replyMessage.file_info
                              );
                              return Array.isArray(fileInfo) &&
                                fileInfo.length > 0
                                ? fileInfo[0]?.original_name || 'file'
                                : null;
                            } catch {
                              return null;
                            }
                          }
                          return null;
                        })()}
                    </span>
                    <p className="text-xs font-normal">
                      {replyMessage.sender.name},{' '}
                      {format(
                        new Date(replyMessage?.created_at),
                        'dd/MM/yyyy h:mm a'
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div
              className={cn(
                'flex h-max gap-2 border-t bg-white p-4',
                openImagePreview && 'border-t-0'
              )}
            >
              <div className="relative w-full">
                {isEmojiPickerOpen && (
                  <span className="absolute bottom-12 right-0 z-50">
                    <EmojiPicker
                      open={isEmojiPickerOpen}
                      onEmojiClick={(emojiObject) =>
                        setInput((prevInput) => prevInput + emojiObject.emoji)
                      }
                    />
                  </span>
                )}
                <Input
                  type="text"
                  value={input}
                  onChange={handleChange}
                  // onKeyUp={handleKeyUp}
                  // onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
                <span className="absolute right-2 top-1">
                  <VscReactions
                    size={25}
                    className="cursor-pointer"
                    onClick={() =>
                      setIsEmojiPickerOpen((prev: boolean) => !prev)
                    }
                  />
                </span>
              </div>
              <Input
                type="file"
                id="image"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              {isEdit ? (
                <span
                  className="rounded-lg bg-blue-600 px-2.5 py-2 text-white hover:bg-blue-700"
                  onClick={() => {
                    setIsEdit(false);
                    setEditMessageId(null);
                    setInput('');
                  }}
                >
                  <VscChromeClose />
                </span>
              ) : (
                <label
                  htmlFor="image"
                  className="rounded-lg bg-blue-600 px-2.5 py-2 text-white hover:bg-blue-700"
                >
                  <FaRegImage />
                </label>
              )}
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-2.5 py-2 text-white hover:bg-blue-700"
              >
                <VscSend />
              </button>
            </div>
          </form>
        </div>

        {/* Profile Drawer */}
        <ProfileDrawer
          open={isDrawerOpen}
          setOpen={setIsDrawerOpen}
          chat={currentChatUser}
          currentUser={userDetails}
          resetChatDetails={resetChatDetails}
          token={token}
        />
      </div>
    </div>
  );
};

export default ChatBox;
