const PermissionsList = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Chat"
            className="w-full rounded-lg bg-gray-200 px-4 py-2"
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-gray-600">Active Chats</h2>

          <div className="flex cursor-pointer items-center space-x-4">
            <img
              src="https://via.placeholder.com/40"
              alt="Sujika"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium">Sujika</p>
              <p className="text-sm text-gray-500">Need to go for lunch?</p>
            </div>
            <span className="text-xs text-gray-400">1:32PM</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button className="font-semibold text-gray-600">Groups</button>
          <button className="font-semibold text-gray-600">Calls</button>
        </div>
      </div>

      <div className="w-2/4 border-l border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h3 className="font-bold text-gray-700">Emiley Jackson</h3>
              <p className="text-sm text-gray-400">online</p>
            </div>
          </div>
          <div className="space-x-4">
            <button className="rounded-full bg-gray-100 p-2 text-gray-600">
              📞
            </button>
            <button className="rounded-full bg-gray-100 p-2 text-gray-600">
              🎥
            </button>
            <button className="rounded-full bg-gray-100 p-2 text-gray-600">
              ⚙️
            </button>
          </div>
        </div>

        <div className="h-4/5 space-y-4 overflow-y-auto">
          <div className="flex items-end">
            <img
              src="https://via.placeholder.com/40"
              alt="Emiley Jackson"
              className="h-8 w-8 rounded-full"
            />
            <div className="ml-4 rounded-xl bg-gray-100 p-4">
              <p className="text-sm">Nice to meet you 😊</p>
            </div>
            <span className="ml-2 text-xs text-gray-400">11:48PM</span>
          </div>

          <div className="flex items-end justify-end">
            <div className="ml-4 rounded-xl bg-blue-500 p-4 text-white">
              <p className="text-sm">It is a long established fact...</p>
            </div>
            <span className="ml-2 text-xs text-gray-400">11:50PM</span>
          </div>

          <div className="flex items-end">
            <img
              src="https://via.placeholder.com/40"
              alt="Emiley Jackson"
              className="h-8 w-8 rounded-full"
            />
            <div className="ml-4 rounded-xl bg-gray-100 p-4">
              <p className="text-sm">Who are you?</p>
            </div>
            <span className="ml-2 text-xs text-gray-400">11:51PM</span>
          </div>
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="text"
            placeholder="Type your message here..."
            className="flex-1 rounded-lg border bg-gray-100 px-4 py-2"
          />
          <button className="ml-4 rounded-lg bg-blue-500 p-2 text-white">
            Send
          </button>
        </div>
      </div>

      <div className="w-1/4 border-l border-gray-200 bg-white p-4">
        <div className="text-center">
          <img
            src="https://via.placeholder.com/80"
            alt="Emiley Jackson"
            className="mx-auto h-20 w-20 rounded-full"
          />
          <h3 className="mt-4 font-bold">Emiley Jackson</h3>
          <p className="text-sm text-gray-400">emaileyjackson2134@gmail.com</p>
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-gray-600">Shared Files</h4>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center justify-between">
              <p className="text-gray-600">Project Details.pdf</p>
              <span className="text-xs text-gray-400">
                24, Oct 2022 - 14:24PM
              </span>
              <button className="text-blue-500">⬇️</button>
            </li>

            <li className="flex items-center justify-between">
              <p className="text-gray-600">Img_02.jpg</p>
              <span className="text-xs text-gray-400">
                22, Oct 2022 - 10:19AM
              </span>
              <button className="text-blue-500">⬇️</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PermissionsList;
