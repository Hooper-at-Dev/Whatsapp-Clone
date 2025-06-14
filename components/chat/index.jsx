"use client"

import { motion } from "framer-motion"
import dayjs from "dayjs"
import { useRouter } from "next/dist/client/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import { auth, db } from "../../firebase"
import getRecipientEmail from "../../utils/getRecipientEmail"
import localizedFormat from "dayjs/plugin/localizedFormat"

const Chat = ({ id, users, activeChat }) => {
  const router = useRouter()
  const [user] = useAuthState(auth)

  const recipientEmail = getRecipientEmail(users, user)
  const [recipientSnapshot] = useCollection(db.collection("users").where("email", "==", recipientEmail || ""))
  const [messagesSnapshot] = useCollection(
    db.collection("chats").doc(id).collection("messages").orderBy("timestamp", "desc"),
  )

  const recipient = recipientSnapshot?.docs?.[0]?.data()
  const message = messagesSnapshot?.docs?.[0]?.data()

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  dayjs.extend(localizedFormat)

  // Enhanced animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      scale: 1.03,
      y: -4,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.97,
      transition: {
        duration: 0.1,
      },
    },
  }

  const avatarVariants = {
    initial: { scale: 0, rotate: -360 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
    hover: {
      scale: 1.15,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  }

  const contentVariants = {
    initial: { opacity: 0, x: -30 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const messageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.4,
        ease: "backOut",
      },
    },
  }

  const pulseVariants = {
    animate: {
      boxShadow: [
        "0 0 0 0 rgba(236, 72, 153, 0.4)",
        "0 0 0 20px rgba(236, 72, 153, 0)",
        "0 0 0 0 rgba(236, 72, 153, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
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
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  }

  return (
    <motion.div
      onClick={enterChat}
      className={`relative overflow-hidden cursor-pointer p-5 m-3 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 ${
        activeChat === id
          ? "bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-indigo-500/30 border-pink-400/50 shadow-2xl shadow-pink-500/25"
          : "bg-white/10 border-white/20 hover:bg-gradient-to-br hover:from-pink-500/20 hover:via-purple-500/20 hover:to-indigo-500/20 hover:border-pink-400/40 hover:shadow-xl hover:shadow-purple-500/20"
      }`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-500/20 to-indigo-400/20 opacity-0 rounded-3xl"
        whileHover={{
          opacity: 1,
          background: [
            "linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(147, 51, 234, 0.2), rgba(99, 102, 241, 0.2))",
            "linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2), rgba(147, 51, 234, 0.2))",
            "linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Active chat pulse effect */}
      {activeChat === id && (
        <motion.div className="absolute inset-0 rounded-3xl" variants={pulseVariants} animate="animate" />
      )}

      {/* Sparkle effects */}
      <motion.div
        className="absolute top-3 right-3 w-2 h-2 bg-yellow-300 rounded-full"
        variants={sparkleVariants}
        animate="animate"
        style={{ animationDelay: "0s" }}
      />
      <motion.div
        className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-pink-300 rounded-full"
        variants={sparkleVariants}
        animate="animate"
        style={{ animationDelay: "0.7s" }}
      />
      <motion.div
        className="absolute top-1/2 right-8 w-1 h-1 bg-purple-300 rounded-full"
        variants={sparkleVariants}
        animate="animate"
        style={{ animationDelay: "1.4s" }}
      />

      <div className="relative flex items-center z-10">
        {recipient ? (
          <motion.div variants={avatarVariants} whileHover="hover">
            <div className="recipient-avatar avatar m-1 mr-5">
              <motion.div
                className="w-16 h-16 rounded-full overflow-hidden relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Enhanced avatar ring with animated gradient */}
                <motion.div
                  className="absolute inset-0 rounded-full p-1"
                  animate={{
                    background: [
                      "linear-gradient(0deg, #f59e0b, #ef4444, #8b5cf6)",
                      "linear-gradient(120deg, #ef4444, #8b5cf6, #f59e0b)",
                      "linear-gradient(240deg, #8b5cf6, #f59e0b, #ef4444)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-full h-full bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center overflow-hidden">
                    <img
                      src={recipient?.photoURL || "/placeholder.svg"}
                      alt={recipientEmail + "'s" + " Avatar"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Animated online indicator */}
                <motion.div
                  className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.7)",
                      "0 0 0 8px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0)",
                    ],
                  }}
                  transition={{
                    delay: 0.6,
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={avatarVariants} whileHover="hover">
            <div className="recipient-avatar avatar placeholder m-1 mr-5">
              <motion.div
                className="w-16 h-16 rounded-full relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Placeholder avatar with animated gradient */}
                <motion.div
                  className="absolute inset-0 rounded-full p-1"
                  animate={{
                    background: [
                      "linear-gradient(0deg, #f59e0b, #ef4444, #8b5cf6)",
                      "linear-gradient(120deg, #ef4444, #8b5cf6, #f59e0b)",
                      "linear-gradient(240deg, #8b5cf6, #f59e0b, #ef4444)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-full h-full bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <motion.span
                      className="text-2xl font-bold text-white drop-shadow-lg"
                      animate={{
                        textShadow: [
                          "0 0 10px rgba(255,255,255,0.5)",
                          "0 0 20px rgba(255,255,255,0.8)",
                          "0 0 10px rgba(255,255,255,0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {recipientEmail?.[0].toUpperCase()}
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        <motion.div className="grid w-full" variants={contentVariants}>
          <div>
            <motion.span
              className="font-bold text-lg md:text-xl text-white drop-shadow-md"
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 15px rgba(255,255,255,0.8)",
              }}
              transition={{ duration: 0.2 }}
            >
              {recipient && recipient.username && recipient.username.length ? recipient.username : recipientEmail}
            </motion.span>

            {message ? (
              <motion.div
                className="text-sm text-white/80 flex items-center justify-between mt-2"
                variants={messageVariants}
              >
                <motion.p
                  className="flex mr-3 font-medium text-white/80 max-w-[7ch] truncate"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {message?.message}
                </motion.p>
                <motion.p
                  className="mb-auto text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold border border-white/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {message?.timestamp ? dayjs(message.timestamp.toDate()).format("LT") : "..."}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                className="text-sm text-white/80 flex items-center justify-between mt-2"
                variants={messageVariants}
              >
                <motion.p
                  className="flex items-center font-medium"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.span
                    className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full mr-3 shadow-lg"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                      boxShadow: [
                        "0 0 0 0 rgba(34, 197, 94, 0.7)",
                        "0 0 0 6px rgba(34, 197, 94, 0)",
                        "0 0 0 0 rgba(34, 197, 94, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  🔒 This chat is encrypted.
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced hover arrow indicator */}
        <motion.div
          className="opacity-0 ml-3"
          whileHover={{
            opacity: 1,
            x: 8,
            scale: 1.2,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-8 h-8 text-white/80"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced floating particles effect on hover */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full opacity-0 ${
            ["bg-pink-300", "bg-yellow-300", "bg-purple-300", "bg-blue-300", "bg-green-300", "bg-orange-300"][i]
          }`}
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
          }}
          whileHover={{
            opacity: [0, 1, 0],
            y: [-10, -25, -40],
            x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
            scale: [1, 1.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  )
}

export { Chat }
