import { auth } from '@/auth';
import UserTable from '@/components/user-management/UserTable';
import { UserShape } from '@/server/types/user';

// async function getUsers() {
//   const session = await auth();

//   if (session?.user?.apiUserToken) {
//     try {
//       const response = await fetch(
//         `/api/generic-model/user`,
//       );

//       if (response.ok) {

//         console.log('response', response?.json());

//         return response.json();

//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   }
//   return null;
// }

const UserList = async () => {
  // const userResponse = await getUsers();

  // console.log(userResponse);

  // const users = userResponse?.models || null;

  // if (!users) {
  //   return (
  //     <div>
  //       <h1>Failed to load users</h1>
  //     </div>
  //   );
  // }

  return <UserTable />;
};

export default UserList;
