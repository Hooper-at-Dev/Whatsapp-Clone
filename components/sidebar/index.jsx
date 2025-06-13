import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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

// Animation variants for background stars
const starVariants = {
  twinkle: {
    opacity: [0.3, 0.8, 0.3],
    scale: [1, 1.2, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: Math.random() * 3
    }
  }
};

const Sidebar = ({ activeChat }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.email || "");

  const [chatsSnapshot] = useCollection(user ? userChatRef : null);
  const [chatQuery, setChatQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
      console.log(chatId);
      // router.push(`/chat/${chatId}`);
    } else {
      console.error("Chat ID is undefined, cannot navigate");
    }
  };

  // Animation variants
  const sidebarVariants = {
    initial: { x: -350, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const containerVariants = {
    initial: { marginLeft: "-20px", opacity: 0 },
    animate: { 
      marginLeft: "12px",
      opacity: 1,
      transition: { 
        duration: 1.2,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const headerVariants = {
    initial: { y: -50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const avatarVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.7,
        type: "spring",
        stiffness: 200
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const searchVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.3 }
    }
  };

  const chatListVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        delay: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const chatItemVariants = {
    initial: { x: -50, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      x: 8,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative"
    >
      <motion.section 
        className="main-container lg:w-80 sticky h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 relative font-mono rounded-r-3xl shadow-2xl"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(147, 51, 234, 0.08) 0.3%, transparent 2%),
            radial-gradient(circle at 85% 75%, rgba(59, 130, 246, 0.06) 0.3%, transparent 2%),
            radial-gradient(circle at 45% 45%, rgba(236, 72, 153, 0.04) 0.3%, transparent 2%),
            radial-gradient(circle at 25% 85%, rgba(16, 185, 129, 0.05) 0.3%, transparent 2%),
            linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%)
          `,
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(148, 163, 184, 0.1)',
        }}
        variants={sidebarVariants}
        initial="initial"
        animate="animate"
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-16 left-8 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"
          animate={{
            y: [-8, 8, -8],
            x: [-4, 4, -4],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-24 right-8 w-20 h-20 bg-blue-500/8 rounded-full blur-2xl"
          animate={{
            y: [8, -8, 8],
            x: [4, -4, 4],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-4 w-16 h-16 bg-emerald-500/6 rounded-full blur-xl"
          animate={{
            y: [-6, 6, -6],
            x: [-2, 2, -2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        {/* Enhanced twinkling stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              backgroundColor: ['#60a5fa', '#a78bfa', '#34d399', '#f472b6'][Math.floor(Math.random() * 4)],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 8 + 4}px currentColor`,
            }}
            variants={starVariants}
            animate="twinkle"
          />
        ))}

        {/* Header */}
        <motion.div 
          className="header backdrop-blur-xl bg-slate-800/40 border-b border-slate-700/50 shadow-2xl flex sticky top-0 z-10 justify-between items-center p-5 h-20"
          variants={headerVariants}
        >
          <div className="dropdown">
            <motion.button
              className="border-none bg-transparent hover:bg-slate-700/40 transition-all duration-300 rounded-2xl p-2"
              variants={avatarVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              tabIndex={0}
            >
              <div className="avatar relative">
                <div className="w-12 h-12 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 rounded-full p-0.5 shadow-lg">
                    <div className="w-full h-full bg-slate-900 rounded-full overflow-hidden">
                      <img 
                        src={user?.photoURL} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Online indicator */}
                  <motion.div
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg shadow-emerald-400/50"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  />
                </div>
              </div>
            </motion.button>
            <ul
              tabIndex={0}
              className="p-3 shadow-2xl menu dropdown-content bg-slate-800/90 backdrop-blur-xl rounded-2xl w-64 border border-slate-600/50"
            >
              <motion.li 
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
              >
                <a 
                  onClick={() => auth.signOut()} 
                  className="flex text-slate-200 hover:bg-black  transition-colors rounded-xl cursor-pointer py-3"
                >
                  <LogoutIcon className="w-5 h-5 mr-3 text-slate-300 " /> Log Out
                </a>
              </motion.li>
            </ul>
          </div>

          <motion.div 
            className="header__icons"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="dropdown dropdown-end">
              <motion.div 
                tabIndex={0} 
                className="p-2.5 rounded-full bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 cursor-pointer shadow-lg"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <DotsVerticalIcon className="w-5 h-5 text-slate-300" />
              </motion.div>
              <ul
                tabIndex={0}
                className="p-3 shadow-2xl menu dropdown-content bg-slate-800/90 backdrop-blur-xl rounded-2xl w-64 border border-slate-600/50"
              >
                <motion.li 
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <a 
                    onClick={changeTheme} 
                    className="flex text-slate-200 hover:bg-slate-700/50 transition-colors rounded-xl cursor-pointer py-3"
                  >
                    {theme === "light" ? (
                      <MoonIcon className="w-5 h-5 mr-3 text-slate-300" />
                    ) : (
                      <SunIcon className="w-5 h-5 mr-3 text-slate-300" />
                    )}
                    {theme === "light" ? "Dark" : "Light"} mode
                  </a>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="searchbar flex items-center px-6 pt-5 pb-3"
          variants={searchVariants}
        >
          <motion.div 
            className="relative flex-1"
            animate={isSearchFocused ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
              animate={isSearchFocused ? { scale: 1.1, x: 2 } : { scale: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SearchIcon className="w-5 h-5 text-slate-300 filter-none" style={{ filter: 'none' }} />
            </motion.div>
            <motion.input
              placeholder="Search for a chat"
              className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-600/40 rounded-2xl pl-12 pr-5 py-3.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 shadow-inner"
              style={{ 
                filter: 'none',
                backdropFilter: 'blur(8px)'
              }}
              value={chatQuery}
              onChange={(event) => setChatQuery(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>
        </motion.div>

        {/* New Chat Button */}
        <motion.div
          className="px-6 pb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.a
            href="#new"
            className="chatbutton flex justify-center items-center w-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 hover:from-purple-600 hover:via-blue-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChatIcon className="w-6 h-6 mr-3" />
            </motion.div>
            Start a new chat
          </motion.a>
        </motion.div>

        {/* Chat List */}
        <motion.div 
          className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600/40 scrollbar-track-transparent px-3"
          style={{ height: 'calc(100vh - 220px)' }}
          variants={chatListVariants}
        >
          <AnimatePresence>
            {chatsSnapshot ? (
              chatsSnapshot.docs
                ?.filter((chat) =>
                  chat
                    .data()
                    .users.find((user) =>
                      user.toLowerCase().includes(chatQuery.toLowerCase())
                    )
                )
                .map((chat, index) => (
                  <motion.div 
                    key={chat.id} 
                    onClick={() => handleChatClick(chat.id)}
                    variants={chatItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ delay: index * 0.08 }}
                    className="mb-3"
                  >
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-600/30 hover:bg-slate-700/60 hover:border-slate-500/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl">
                      <Chat
                        id={chat.id}
                        users={chat.data().users}
                        activeChat={activeChat}
                      />
                    </div>
                  </motion.div>
                ))
            ) : (
              <motion.div 
                className="flex justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FoldingCube color="#94a3b8" size={32} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced floating decorative elements */}
        <motion.div
          className="absolute top-40 right-6 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/60"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 1, 0.4],
            x: [0, 5, 0],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute bottom-40 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/60"
          animate={{
            scale: [1, 2.2, 1],
            opacity: [0.3, 1, 0.3],
            x: [0, -5, 0],
            y: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1.2
          }}
        />
        <motion.div
          className="absolute top-60 left-10 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/60"
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: 2
          }}
        />
      </motion.section>
    </motion.div>
  );
};

export { Sidebar };