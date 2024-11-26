import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import { auth } from '@/auth';
import UserDatails from '@/components/user-management/UserDetails';
import UserTable from '@/components/user-management/UserTable';
import { modelConfigs } from '@/server/model-config';
import { UserShape } from '@/server/types/user';

// async function fetchUserDetails(userId: string) {
//   let session = await auth();

//   let url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/zen/user?filter[id]=${userId}`;

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${session?.user?.apiUserToken}`
//       }
//     });

//     if (response.ok) {
//       return response.json();
//     } else {
//       console.error('Error fetching users:', response.statusText);
//       return false;
//     }
//   } catch (error: any) {
//     console.error('Error fetching users:', error);
//     return false;
//   }
// }

// async function fetchUserDetails(userId: string) {

//   console.log('fetchUserDetails', userId);

//   try {
//     const response = await fetch(`/api/generic-model/user/${userId}`,{
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });

//     console.log(response);

//   } catch (error: any) {
//     console.error('Error fetching users:', error);
//     return false;
//   }
// }

const UserList = async ({
  params: { userId }
}: {
  params: {
    userId: string;
  };
}) => {
  // let userResp = await fetchUserDetails(userId);

  // let users = userResp?.body.data;

  // const session = await auth();

  // let users: UserShape[] = [];

  // console.log(users);

  // if (!users) {
  //   return (
  //     <div>
  //       <h1>Failed to load user details</h1>
  //     </div>
  //   );
  // }

  return <UserDatails />;
};

export default UserList;
