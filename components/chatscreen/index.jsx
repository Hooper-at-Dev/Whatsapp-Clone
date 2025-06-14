"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, Paperclip, User, Smile, Lock, Mic, Send } from "lucide-react"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import { auth, db } from "../../firebase"
import { Picker } from "emoji-mart"
import firebase from "firebase"
import { useEffect, useRef, useState } from "react"
import getRecipientEmail from "../../utils/getRecipientEmail"
import Timeago from "react-timeago"

// Enhanced animation variants for chat messages
const messageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.8, rotateX: -15 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 100,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.8,
    rotateX: 15,
    transition: { duration: 0.4 },
  },
}

// Enhanced background animation variants
const floatingVariants = {
  float: {
    y: [-20, 20, -20],
    x: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 8,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const sparkleVariants = {
  twinkle: {
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1.5, 0.8],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
      delay: Math.random() * 2,
    },
  },
}

function Chatscreen({ chat, messages, onHeaderClick }) {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)
  const [input, setInput] = useState("")
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const recipientEmail = chat && chat.users ? getRecipientEmail(chat.users, user) : null // Moved up to avoid conditional hook call
  const [recipientSnapshot] = useCollection(
    recipientEmail ? db.collection("users").where("email", "==", recipientEmail) : null,
  )
  const [messagesSnapshot] = useCollection(
    db.collection("chats").doc(chat.id).collection("messages").orderBy("timestamp", "asc"),
  )

  const endOfMessagesRef = useRef(null)

  // Enhanced animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const headerVariants = {
    initial: { y: -80, opacity: 0, scale: 0.9 },
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
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  const inputVariants = {
    initial: { y: 80, opacity: 0, scale: 0.9 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.4,
      },
    },
  }

  const messageContainerVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  // Handle loading, error, and user states with enhanced styling
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="w-20 h-20 border-4 border-pink-500/50 border-t-yellow-400 rounded-full shadow-lg"
        />
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
        <motion.div
          className="bg-red-500/20 backdrop-blur-lg p-8 rounded-3xl text-white border border-red-400/50 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          ❌ Error: {error.message}
        </motion.div>
      </div>
    )

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
        <motion.div
          className="bg-blue-500/20 backdrop-blur-lg p-8 rounded-3xl text-white border border-blue-400/50 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🔐 Please log in
        </motion.div>
      </div>
    )

  console.log("Chatscreen chat prop:", chat)

  if (!chat || !chat.users || !Array.isArray(chat.users)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
        <motion.div
          className="bg-orange-500/20 backdrop-blur-lg p-8 rounded-3xl text-white border border-orange-400/50 shadow-2xl max-w-md text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          ⚠️ Error: Invalid chat data. Chat object: {JSON.stringify(chat, null, 2)}
        </motion.div>
      </div>
    )
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data()

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesSnapshot])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsTyping(true)

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.email,
      message: input,
      photoURL: user.photoURL,
      receiverHasRead: false,
    })

    setInput("")
    setIsTyping(false)
    scrollToBottom()
  }

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs?.map((message, index) => {
        const messageData = message.data()
        const isUser = messageData.user === user.email
        return (
          <motion.div
            key={message.id}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <motion.div
              className={`max-w-xs lg:max-w-md xl:max-w-lg p-5 rounded-3xl shadow-2xl backdrop-blur-lg border-2 relative overflow-hidden ${
                isUser
                  ? "bg-gradient-to-br from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-white border-pink-400/50"
                  : "bg-white/20 text-white border-white/30"
              }`}
              whileHover={{
                scale: 1.02,
                y: -2,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Message bubble sparkle effect */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />

              <p className="text-sm font-medium leading-relaxed">{messageData.message}</p>
              {messageData.timestamp && (
                <motion.p
                  className={`text-xs mt-3 ${isUser ? "text-white/80" : "text-white/70"} font-semibold`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Timeago date={messageData.timestamp.toDate()} />
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )
      })
    } else {
      return (
        <div className="flex justify-center py-12">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
            className="w-12 h-12 border-4 border-pink-500/50 border-t-yellow-400 rounded-full"
          />
        </div>
      )
    }
  }

  return (
    <motion.div
      className="main-container min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 relative font-mono overflow-hidden flex flex-col"
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
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Enhanced animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="float"
      />
      <motion.div
        className="absolute bottom-40 right-20 w-36 h-36 bg-purple-500/12 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "2s" }}
      />
      <motion.div
        className="absolute top-1/2 right-12 w-32 h-32 bg-indigo-500/8 rounded-full blur-2xl"
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "4s" }}
      />

      {/* Enhanced twinkling stars */}
      {[...Array(40)].map((_, i) => (
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
        className="cursor-pointer header sticky top-0 left-0 right-0 z-50 mx-6 lg:mx-10 mt-6 flex items-center p-6 h-24 bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-2xl hover:bg-white/15 transition-all duration-500"
        variants={headerVariants}
        onClick={onHeaderClick}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
        }}
      >
        {recipient ? (
          <motion.div className="header__recipient-avatar" variants={avatarVariants} whileHover="hover">
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
                    src={recipient?.photoURL || "/placeholder.svg"}
                    alt={recipientEmail + "'s" + " Avatar"}
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
                  delay: 0.8,
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div className="header__recipient-avatar" variants={avatarVariants} whileHover="hover">
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
                <div className="w-full h-full bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl font-bold text-white">
                    {recipientEmail ? recipientEmail[0].toUpperCase() : "?"}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="header__information ml-5 flex-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h3
            className="text-2xl font-bold mb-1 text-white drop-shadow-lg"
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 20px rgba(255,255,255,0.8)",
            }}
          >
            {recipient ? recipient.username : recipientEmail || "Unknown"}
          </motion.h3>
          {recipientSnapshot ? (
            recipient?.lastSeen?.toDate() ? (
              <p className="text-sm text-white/80 font-medium">
                Last active: <Timeago date={recipient?.lastSeen?.toDate()} />
              </p>
            ) : (
              <p className="text-sm text-white/80 font-medium">Last active: Unavailable</p>
            )
          ) : (
            <p className="text-sm text-white/80 font-medium">Loading...</p>
          )}
        </motion.div>

        <motion.div
          className="header__icons flex space-x-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.button
            className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <User className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
            type="button"
            onClick={scrollToBottom}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ArrowDown className="w-6 h-6 text-white" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Messages Container */}
      <motion.div
        className="message-container flex-1 p-10 px-6 lg:px-10 pt-10 pb-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        variants={messageContainerVariants}
      >
        {/* Enhanced end-to-end encryption notice */}
        <motion.div
          className="end-to-end-notification p-6 rounded-3xl mx-auto max-w-lg mb-8 bg-white/10 backdrop-blur-2xl border-2 border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center text-white">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Lock className="w-8 h-8 mr-4 text-green-400 drop-shadow-lg" />
            </motion.div>
            <div>
              <p className="text-base font-bold mb-1">🔒 End-to-End Encrypted</p>
              <p className="text-sm text-white/80">Messages are secured. No one outside of this chat can read them.</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>{showMessages()}</AnimatePresence>
        <div className="message-container__end-of-message mt-20 float-left clear-both" ref={endOfMessagesRef} />
      </motion.div>

      {/* Enhanced Input Container */}
      <motion.form
        className="input-container fixed bottom-0 left-0 right-0 z-50 p-6 mx-6 lg:mx-10 mb-6"
        variants={inputVariants}
        onSubmit={sendMessage}
      >
        <div
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-2xl p-5"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <AnimatePresence>
            {emojiPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="absolute bottom-full left-6 mb-4"
              >
                <Picker
                  title=""
                  emoji=""
                  set="facebook"
                  onSelect={(emoji) => {
                    setInput(input + emoji.native)
                    setEmojiPickerOpen(false)
                  }}
                  color="#ec4899"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center space-x-4">
            <motion.button
              type="button"
              onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Smile className="w-6 h-6 text-white" />
            </motion.button>

            <motion.button
              type="button"
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Paperclip className="w-6 h-6 text-white" />
            </motion.button>

            <motion.input
              type="text"
              className="flex-1 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl px-8 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-300 shadow-inner text-lg font-medium"
              value={input}
              placeholder="Type a message... ✨"
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                setEmojiPickerOpen(false)
                setIsInputFocused(true)
              }}
              onBlur={() => setIsInputFocused(false)}
              animate={isInputFocused ? { scale: 1.02, borderColor: "rgba(236, 72, 153, 0.5)" } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ backdropFilter: "blur(10px)" }}
            />

            <AnimatePresence>
              {input && (
                <motion.button
                  type="submit"
                  className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-2xl border-2 border-white/20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  whileHover={{
                    scale: 1.15,
                    boxShadow: "0 0 30px rgba(236, 72, 153, 0.6)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Send className="w-6 h-6 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {!input && (
              <motion.button
                type="button"
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Mic className="w-6 h-6 text-white" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.form>

      {/* Enhanced floating decorative elements */}
      {[...Array(8)].map((_, i) => (
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
            ][i]
          }`}
          style={{
            width: Math.random() * 3 + 2 + "px",
            height: Math.random() * 3 + 2 + "px",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: `0 0 ${Math.random() * 15 + 10}px currentColor`,
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.4, 1, 0.4],
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  )
}

export { Chatscreen as ChatScreen }
