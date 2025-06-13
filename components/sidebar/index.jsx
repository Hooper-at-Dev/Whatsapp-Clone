import {
  AnnotationIcon as ChatIcon,
  DotsVerticalIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import { Chat } from "../chat"; // Direct import
import FoldingCube from "better-react-spinkit/dist/FoldingCube";
import { useEffect, useState } from "react";
import { LogoutIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

const Sidebar = ({ activeChat }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.email || "");

  const [chatsSnapshot] = useCollection(user ? userChatRef : null);
  const [chatQuery, setChatQuery] = useState("");
  const [theme, setTheme] = useState("light");

  const updateTheme = () => {
    const localTheme = localStorage.getItem("theme") ?? theme;
    setTheme(localTheme);
    document.querySelector("html")?.setAttribute("data-theme", localTheme);
    if (localTheme === "dark") {
      document.querySelector("html")?.classList.add("dark");
    }
  };

  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.querySelector("html")?.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") {
      document.querySelector("html")?.classList.add("dark");
    } else {
      document.querySelector("html")?.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    updateTheme();
  }, []);

  const handleChatClick = (chatId) => {
    if (chatId) {
      console.log(chatId)
      // router.push(`/chat/${chatId}`);
    } else {
      console.error("Chat ID is undefined, cannot navigate");
    }
  };

  return (
    <section className="main-container border-r-2 lg:w-80 border-gray-100 dark:border-gray-700 sticky h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
      <div className="header bg-base-200 shadow-sm flex sticky top-0 z-10 justify-between items-center p-4 h-20 border-b-2 border-solid dark:border-gray-700">
        <div className="dropdown">
          <button
            className="border-none btn btn-square btn-lg btn-ghost mask mask-squircle hover:bg-base-100"
          >
            <div className="avatar online">
              <div className="w-12 h-12 rounded-full">
                <img src={user?.photoURL} alt="User Avatar" />
              </div>
            </div>
          </button>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-64"
          >
            <li>
              <a onClick={() => auth.signOut()} className="flex">
                <LogoutIcon className="w-5 h-5 mr-1" /> Log Out
              </a>
            </li>
          </ul>
        </div>

        <div className="header__icons">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle">
              <DotsVerticalIcon className="w-6 h-6 text-gray-500 dark:text-gray-100" />
            </div>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-64"
            >
              <li>
                <a onClick={changeTheme} className="flex">
                  {theme === "light" ? (
                    <MoonIcon className="w-5 h-5 mr-1" />
                  ) : (
                    <SunIcon className="w-5 h-5 mr-1" />
                  )}{" "}
                  {theme === "light" ? "Dark" : "Light"} mode
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="searchbar flex items-center px-5 pt-1">
        <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-100" />
        <input
          placeholder="Search for a chat"
          className="searchbar__input rounded-full input input-ghost"
          value={chatQuery}
          onChange={(event) => setChatQuery(event.target.value)}
        />
      </div>
      <a
        href="#new"
        className="chatbutton flex justify-center btn btn-primary dark:btn-secondary border-t-2 border-solid m-2"
      >
        <ChatIcon className="w-6 h-6 text-gray-100 mr-1" />
        Start a new chat
      </a>

      {chatsSnapshot ? (
        chatsSnapshot.docs
          ?.filter((chat) =>
            chat
              .data()
              .users.find((user) =>
                user.toLowerCase().includes(chatQuery.toLowerCase())
              )
          )
          .map((chat) => (
            <div key={chat.id} onClick={() => handleChatClick(chat.id)}>
              <Chat
                id={chat.id}
                users={chat.data().users}
                activeChat={activeChat}
              />
              <div className="border-t-2 border-gray-100 dark:border-gray-700"></div>
            </div>
          ))
      ) : (
        <div className="flex justify-center">
          <FoldingCube color="#25D366" size={30} />
        </div>
      )}
    </section>
  );
};

export { Sidebar };