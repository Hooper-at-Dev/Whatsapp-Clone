"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, MessageCircle, MoreVertical, LogOut, Moon, Sun } from "lucide-react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import { auth, db } from "../../firebase"
import { Chat } from "../chat"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// Enhanced animation variants
const sidebarVariants = {
  initial: { x: -400, opacity: 0, scale: 0.95 },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const sparkleVariants = {
  twinkle: {
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1.5, 0.8],
    rotate: [0, 180, 360],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
      delay: Math.random() * 3,
    },
  },
}

const floatingVariants = {
  float: {
    y: [-15, 15, -15],
    x: [-8, 8, -8],
    rotate: [0, 5, -5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 10,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const Sidebar = ({ activeChat }) => {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const userChatRef = db.collection("chats").where("users", "array-contains", user?.email || "")

  const [chatsSnapshot] = useCollection(user ? userChatRef : null)
  const [chatQuery, setChatQuery] = useState("")
  const [theme, setTheme] = useState("light")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const updateTheme = () => {
    const localTheme = localStorage.getItem("theme") ?? theme
    setTheme(localTheme)
    document.querySelector("html")?.setAttribute("data-theme", localTheme)
    if (localTheme === "dark") {
      document.querySelector("html")?.classList.add("dark")
    }
  }

  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.querySelector("html")?.setAttribute("data-theme", newTheme)
    if (newTheme === "dark") {
      document.querySelector("html")?.classList.add("dark")
    } else {
      document.querySelector("html")?.classList.remove("dark")
    }
    localStorage.setItem("theme", newTheme)
  }

  useEffect(() => {
    updateTheme()
  }, [])

  const handleChatClick = (chatId) => {
    if (chatId) {
      console.log(chatId)
    } else {
      console.error("Chat ID is undefined, cannot navigate")
    }
  }

  // Enhanced animation variants
  const headerVariants = {
    initial: { y: -60, opacity: 0, scale: 0.9 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const avatarVariants = {
    initial: { scale: 0, rotate: -360 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
    hover: {
      scale: 1.15,
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.1,
      y: -3,
      boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  const searchVariants = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: 0.4 },
    },
  }

  const chatListVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const chatItemVariants = {
    initial: { x: -60, opacity: 0, scale: 0.9 },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      x: 10,
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.section
      className="main-container w-96 sticky h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 relative font-mono shadow-2xl"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.15) 0.5%, transparent 3%),
          radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.12) 0.5%, transparent 3%),
          radial-gradient(circle at 40% 60%, rgba(99, 102, 241, 0.1) 0.5%, transparent 3%),
          radial-gradient(circle at 60% 20%, rgba(245, 158, 11, 0.08) 0.5%, transparent 3%),
          linear-gradient(135deg, rgba(88, 28, 135, 0.9) 0%, rgba(157, 23, 77, 0.95) 50%, rgba(88, 28, 135, 0.9) 100%)
        `,
        backdropFilter: "blur(20px)",
      }}
      variants={sidebarVariants}
      initial="initial"
      animate="animate"
    >
      {/* Enhanced animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-pink-500/8 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="float"
      />
      <motion.div
        className="absolute bottom-32 right-10 w-28 h-28 bg-purple-500/10 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "3s" }}
      />
      <motion.div
        className="absolute top-1/2 left-6 w-24 h-24 bg-indigo-500/6 rounded-full blur-2xl"
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "6s" }}
      />

      {/* Enhanced twinkling stars */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1 + "px",
            height: Math.random() * 4 + 1 + "px",
            backgroundColor: ["#fbbf24", "#f472b6", "#a78bfa", "#34d399", "#60a5fa"][Math.floor(Math.random() * 5)],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: `0 0 ${Math.random() * 10 + 6}px currentColor`,
          }}
          variants={sparkleVariants}
          animate="twinkle"
        />
      ))}

      {/* Enhanced Header */}
      <motion.div
        className="header backdrop-blur-2xl bg-white/10 border-b-2 border-white/20 shadow-2xl flex sticky top-0 z-10 justify-between items-center p-6 h-24"
        variants={headerVariants}
      >
        <div className="dropdown">
          <motion.button
            className="border-none bg-transparent hover:bg-white/20 transition-all duration-300 rounded-3xl p-3"
            variants={avatarVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            tabIndex={0}
          >
            <div className="avatar relative">
              <div className="w-14 h-14 rounded-full relative">
                <motion.div
                  className="absolute inset-0 rounded-full p-1"
                  animate={{
                    background: [
                      "linear-gradient(0deg, #f59e0b, #ef4444, #8b5cf6)",
                      "linear-gradient(120deg, #ef4444, #8b5cf6, #f59e0b)",
                      "linear-gradient(240deg, #8b5cf6, #f59e0b, #ef4444)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-full h-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <img
                      src={user?.photoURL || "/placeholder.svg"}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
                {/* Enhanced online indicator */}
                <motion.div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-3 border-white shadow-xl"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.7)",
                      "0 0 0 10px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0)",
                    ],
                  }}
                  transition={{
                    delay: 1.2,
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
            </div>
          </motion.button>
          <ul
            tabIndex={0}
            className="p-4 shadow-2xl menu dropdown-content bg-white/10 backdrop-blur-2xl rounded-3xl w-72 border-2 border-white/20"
          >
            <motion.li whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
              <a
                onClick={() => auth.signOut()}
                className="flex text-white hover:bg-white/20 transition-colors rounded-2xl cursor-pointer py-4 font-semibold text-base"
              >
                <LogOut className="w-6 h-6 mr-4 text-white" /> 🚪 Log Out
              </a>
            </motion.li>
          </ul>
        </div>

        <motion.div
          className="header__icons"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="dropdown dropdown-end">
            <motion.div
              tabIndex={0}
              className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-lg border border-white/20"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreVertical className="w-6 h-6 text-white" />
            </motion.div>
            <ul
              tabIndex={0}
              className="p-4 shadow-2xl menu dropdown-content bg-white/10 backdrop-blur-2xl rounded-3xl w-72 border-2 border-white/20"
            >
              <motion.li whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                <a
                  onClick={changeTheme}
                  className="flex text-white hover:bg-white/20 transition-colors rounded-2xl cursor-pointer py-4 font-semibold text-base"
                >
                  {theme === "light" ? (
                    <Moon className="w-6 h-6 mr-4 text-white" />
                  ) : (
                    <Sun className="w-6 h-6 mr-4 text-white" />
                  )}
                  {theme === "light" ? "🌙 Dark" : "☀️ Light"} mode
                </a>
              </motion.li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Search Bar */}
      <motion.div className="searchbar flex items-center px-8 pt-6 pb-4" variants={searchVariants}>
        <motion.div
          className="relative flex-1"
          animate={isSearchFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10"
            animate={isSearchFocused ? { scale: 1.1, x: 3 } : { scale: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="w-6 h-6 text-white/80" />
          </motion.div>
          <motion.input
            placeholder="Search for a chat... 🔍"
            className="w-full bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-300 shadow-inner text-base font-medium"
            style={{
              backdropFilter: "blur(15px)",
            }}
            value={chatQuery}
            onChange={(event) => setChatQuery(event.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
      </motion.div>

      {/* Enhanced New Chat Button */}
      <motion.div
        className="px-8 pb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.a
          href="#new"
          className="chatbutton flex justify-center items-center w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg relative overflow-hidden"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {/* Button sparkle effects */}
          <motion.div
            className="absolute top-3 right-4 w-2 h-2 bg-yellow-300 rounded-full"
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute bottom-3 left-4 w-1.5 h-1.5 bg-white rounded-full"
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1.2,
            }}
          />
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <MessageCircle className="w-7 h-7 mr-4" />
          </motion.div>
          ✨ Start a new chat
        </motion.a>
      </motion.div>

      {/* Enhanced Chat List */}
      <motion.div
        className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-4"
        style={{ height: "calc(100vh - 280px)" }}
        variants={chatListVariants}
      >
        <AnimatePresence>
          {chatsSnapshot ? (
            chatsSnapshot.docs
              ?.filter((chat) => chat.data().users.find((user) => user.toLowerCase().includes(chatQuery.toLowerCase())))
              .map((chat, index) => (
                <motion.div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  variants={chatItemVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                  className="mb-4"
                >
                  <div className="bg-white/5 backdrop-blur-lg rounded-3xl border-2 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl">
                    <Chat id={chat.id} users={chat.data().users} activeChat={activeChat} />
                  </div>
                </motion.div>
              ))
          ) : (
            <motion.div
              className="flex justify-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                }}
                className="w-16 h-16 border-4 border-pink-500/50 border-t-yellow-400 rounded-full shadow-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced floating decorative elements */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            [
              "bg-pink-400",
              "bg-purple-400",
              "bg-indigo-400",
              "bg-yellow-400",
              "bg-green-400",
              "bg-blue-400",
              "bg-orange-400",
              "bg-red-400",
              "bg-cyan-400",
              "bg-lime-400",
              "bg-rose-400",
              "bg-violet-400",
            ][i]
          }`}
          style={{
            width: Math.random() * 3 + 2 + "px",
            height: Math.random() * 3 + 2 + "px",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: `0 0 ${Math.random() * 12 + 8}px currentColor`,
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 1, 0.4],
            x: [0, Math.random() * 15 - 7.5, 0],
            y: [0, Math.random() * 15 - 7.5, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 5,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </motion.section>
  )
}

export { Sidebar }
