import { getSession } from 'next-auth/react';
import socket, {
  createConversation,
  initiateSocketConnection
} from '@/lib/socket';

export const initiateOneToOneConversation = async (
  otherUserId: number,
  callback: () => void
) => {
  const session = await getSession();
  const currentUserId = session?.user?.id as number;
  let created = false;
  if (!socket?.connected) {
    initiateSocketConnection(session?.user?.apiUserToken || '', [
      {
        event: 'newConversation',
        callback: (data) => {
          console.log(data);
        }
      }
    ]);
  }

  if (!currentUserId || !otherUserId) {
    console.error('User ID is missing');
    return;
  }

  createConversation(
    'ONE_TO_ONE',
    [currentUserId, otherUserId],
    undefined,
    undefined,
    (response) => {
      if (response.success) {
        created = true;
        callback();
      } else {
        console.error('Error creating conversation:', response.error);
        created = false;
        callback();
      }
    }
  );

  return { created };
};

// How to use

// const router = useRouter();

// const handleChatRedirect = async () => {
//   await initiateOneToOneConversation(1486, () => {
//     router.push(`/communication/messages`)
//   })
// };
