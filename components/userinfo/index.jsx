"use client"

import { motion } from "framer-motion"
import { Code, Heart, Trash2, X } from "lucide-react"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import { auth, db } from "../../firebase"
import getRecipientEmail from "../../utils/getRecipientEmail"
import Timeago from "react-timeago"

const UserInfo = ({ chat, onCloseButtonClick, hidden }) => {
  const [user, loading, error] = useAuthState(auth)
  const router = useRouter()

  const recipientEmail = getRecipientEmail(chat?.users || [], user)
  const [recipientSnapshot, loadingRecipient, errorRecipient] = useCollection(
    recipientEmail ? db.collection("users").where("email", "==", recipientEmail) : null,
  )
  const recipient = recipientSnapshot?.docs?.[0]?.data()

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
          className="w-16 h-16 border-4 border-pink-500/50 border-t-yellow-400 rounded-full shadow-lg"
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

  console.log("UserInfo chat prop:", chat)

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

  const removeChat = () => {
    db.collection("chats").doc(chat.id).delete()
    router.push("/")
  }

  // Enhanced animation variants
  const containerVariants = {
    initial: { x: 400, opacity: 0, scale: 0.9 },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
    exit: {
      x: 400,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  }

  const headerVariants = {
    initial: { y: -50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
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
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.5 },
    },
  }

  const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3 },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
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

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.section
      className={`main-container h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 relative overflow-hidden font-mono ${
        hidden ? "hidden" : "block"
      }`}
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
      exit="exit"
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
      {[...Array(25)].map((_, i) => (
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
          animate="animate"
        />
      ))}

      {/* Enhanced Header */}
      <motion.div
        className="header bg-white/10 backdrop-blur-2xl sticky z-40 top-0 flex items-center p-6 h-24 border-b-2 border-white/20 shadow-2xl"
        variants={headerVariants}
      >
        <motion.button
          onClick={onCloseButtonClick}
          className="p-3 text-white rounded-2xl mr-4 bg-red-500/80 hover:bg-red-600/90 border-2 border-red-400/50 backdrop-blur-sm transition-all duration-300 shadow-lg"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <X className="w-6 h-6" />
        </motion.button>
        <motion.p
          className="text-2xl font-bold text-white drop-shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          👤 Contact Information
        </motion.p>
      </motion.div>

      {/* Enhanced Info Section */}
      <motion.div className="info relative w-full h-screen z-10" variants={contentVariants}>
        <div className="mt-12 grid justify-center px-8">
          {recipient ? (
            <motion.div className="info__recipient-avatar avatar justify-center mb-6" variants={avatarVariants}>
              <div className="w-24 h-24 relative">
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
                  <div className="w-full h-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm shadow-2xl">
                    <img
                      src={recipient?.photoURL || "/placeholder.svg"}
                      alt={recipientEmail ? recipientEmail + "'s Avatar" : "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
                {/* Enhanced online indicator */}
                <motion.div
                  className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-xl"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.7)",
                      "0 0 0 12px rgba(34, 197, 94, 0)",
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
            <motion.div
              className="info__recipient-avatar avatar placeholder justify-center mb-6"
              variants={avatarVariants}
            >
              <div className="w-24 h-24 relative">
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
                  <div className="w-full h-full bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
                    <span className="text-3xl font-bold text-white">
                      {recipientEmail ? recipientEmail[0].toUpperCase() : "?"}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          <motion.p
            className="text-2xl font-bold text-center text-white mb-3 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {recipient ? recipient.username : recipientEmail || "Unknown"}
          </motion.p>

          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {recipientSnapshot ? (
              recipient?.lastSeen?.toDate() ? (
                <p className="text-base text-white/80 font-medium">
                  ⏰ Last active: <Timeago date={recipient?.lastSeen?.toDate()} />
                </p>
              ) : (
                <p className="text-base text-white/80 font-medium">⏰ Last active: Unavailable</p>
              )
            ) : (
              <p className="text-base text-white/80 font-medium">Loading...</p>
            )}
          </motion.div>

          {recipient && recipient.email === "akshit.singla.dps@gmail.com" ? (
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="badge flex cursor-default bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-2 border-purple-400/50 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-lg">
                <Code className="w-5 h-5 mr-2" /> 💻 Developer Team
              </div>
            </motion.div>
          ) : null}

          <motion.div
            className="danger grid justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.button
              className="btn bg-red-500/80 hover:bg-red-600/90 border-2 border-red-400/50 text-white rounded-3xl backdrop-blur-lg transition-all duration-300 shadow-2xl px-8 py-4 font-bold text-lg"
              onClick={removeChat}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Trash2 className="w-6 h-6 mr-3" /> 🗑️ Delete Chat
            </motion.button>
          </motion.div>

          <motion.div
            className="border-t-2 border-white/20 my-8 mx-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />

          <motion.div
            className="developer text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="text-xl font-bold text-white mb-3 drop-shadow-lg">📝 Developer Notes</p>
            <p className="text-white/80 text-base font-medium leading-relaxed">
              Its just a demo, please dont use it for any important tasks. 🚧
            </p>
          </motion.div>

          <motion.div
            className="border-t-2 border-white/20 my-8 mx-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          />

          <motion.p
            className="flex items-center justify-center text-white text-lg font-semibold drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            Made by SARTHAK 💻
          </motion.p>
        </div>
      </motion.div>

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
    </motion.section>
  )
}

export { UserInfo }
