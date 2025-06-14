"use client"

import { motion } from "framer-motion"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../firebase"

const Message = ({ user, message, newDay }) => {
  const [userLoggedIn] = useAuthState(auth)

  // Enhanced animation variants
  const messageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.9,
      rotateX: -10,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: Math.random() * 2,
      },
    },
  }

  const TypeOfMessage = ({ children }) =>
    user === userLoggedIn.email ? (
      <motion.div
        className="message-element px-6 py-4 pb-8 w-max rounded-3xl m-4 relative text-right ml-auto bg-gradient-to-br from-pink-500/90 via-purple-500/90 to-indigo-500/90 backdrop-blur-lg border-2 border-pink-400/50 shadow-2xl overflow-hidden"
        style={{
          minWidth: "120px",
          backdropFilter: "blur(15px)",
        }}
        variants={messageVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        {/* Sparkle effects for user messages */}
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full"
          variants={sparkleVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white rounded-full"
          variants={sparkleVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
        />

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-500/20 to-indigo-400/20 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10">{children}</div>
      </motion.div>
    ) : (
      <motion.div
        className="message-element px-6 py-4 pb-8 w-max rounded-3xl m-4 relative text-left bg-white/15 backdrop-blur-lg border-2 border-white/30 shadow-2xl overflow-hidden"
        style={{
          minWidth: "120px",
          backdropFilter: "blur(15px)",
        }}
        variants={messageVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        {/* Sparkle effects for other messages */}
        <motion.div
          className="absolute top-2 left-2 w-2 h-2 bg-blue-300 rounded-full"
          variants={sparkleVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-green-300 rounded-full"
          variants={sparkleVariants}
          animate="animate"
          style={{ animationDelay: "0.7s" }}
        />

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-green-500/10 to-purple-400/10 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10">{children}</div>
      </motion.div>
    )

  dayjs.extend(relativeTime)

  return (
    <motion.div
      className="main-container cursor-default grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <TypeOfMessage>
        <motion.div
          className="text-white font-medium leading-relaxed text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {message?.message}
        </motion.div>

        <motion.span
          className={`w-full timestamp text-white/70 p-2 text-xs absolute bottom-0 break-words font-semibold ${
            userLoggedIn.email === user ? "text-right right-0 ml-2" : "text-left left-0 mr-2"
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {message?.timestamp
            ? dayjs(message.timestamp.getTime()).fromNow().replace("a few seconds ago", "Just now ✨")
            : "..."}
        </motion.span>
      </TypeOfMessage>
    </motion.div>
  )
}

export { Message }
