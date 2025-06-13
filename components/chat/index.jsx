import { motion } from 'framer-motion';
import { CheckIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import localizedFormat from "dayjs/plugin/localizedFormat";

const Chat = ({ id, users, activeChat }) => {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const recipientEmail = getRecipientEmail(users, user);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail || "")
  );
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const message = messagesSnapshot?.docs?.[0]?.data();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  dayjs.extend(localizedFormat);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const avatarVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const messageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.3
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(236, 72, 153, 0.3)",
        "0 0 30px rgba(245, 158, 11, 0.4)",
        "0 0 20px rgba(236, 72, 153, 0.3)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      onClick={enterChat}
      className={`relative overflow-hidden cursor-pointer break-words p-4 m-2 rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 ${
        activeChat === id 
          ? "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 shadow-lg" 
          : "bg-white/10 hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-yellow-500/10"
      }`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-purple-500/10 to-yellow-400/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Active chat glow effect */}
      {activeChat === id && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          variants={glowVariants}
          animate="animate"
        />
      )}

      <div className="relative flex items-center z-10">
        {recipient ? (
          <motion.div
            variants={avatarVariants}
            whileHover="hover"
          >
            <div className="recipient-avatar avatar m-1 mr-4">
              <motion.div 
                className="w-14 h-14 rounded-full overflow-hidden relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {/* Avatar ring with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full p-0.5">
                  <div className="w-full h-full bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <img
                      src={recipient?.photoURL}
                      alt={recipientEmail + "'s" + " Avatar"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Online indicator */}
                <motion.div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={avatarVariants}
            whileHover="hover"
          >
            <div className="recipient-avatar avatar placeholder m-1 mr-4">
              <motion.div 
                className="w-14 h-14 rounded-full relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {/* Placeholder avatar with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full p-0.5">
                  <div className="w-full h-full bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xl font-bold text-white drop-shadow-lg">
                      {recipientEmail?.[0].toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="grid w-full"
          variants={contentVariants}
        >
          <div>
            <motion.span 
              className="font-semibold text-base md:text-lg text-white drop-shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {recipient && recipient.username && recipient.username.length
                ? recipient.username
                : recipientEmail}
            </motion.span>
            
            {message ? (
              <motion.div 
                className="text-sm text-white/70 flex items-center justify-between mt-1"
                variants={messageVariants}
              >
                <motion.p 
                  className="flex truncate mr-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {message?.message}
                </motion.p>
                <motion.p 
                  className="mb-auto text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {message?.timestamp
                    ? dayjs(message.timestamp.toDate()).format("LT")
                    : "..."}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div 
                className="text-sm text-white/70 flex items-center justify-between mt-1"
                variants={messageVariants}
              >
                <motion.p 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.span
                    className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  This chat is encrypted.
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Hover arrow indicator */}
        <motion.div
          className="opacity-0 ml-2"
          whileHover={{ opacity: 1, x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-6 h-6 text-white/60">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Floating particles effect on hover */}
      <motion.div
        className="absolute top-2 right-2 w-1 h-1 bg-pink-300 rounded-full opacity-0"
        whileHover={{
          opacity: [0, 1, 0],
          y: [-5, -15, -25],
          x: [0, 5, -5],
          scale: [1, 1.5, 0]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-3 left-20 w-1 h-1 bg-yellow-300 rounded-full opacity-0"
        whileHover={{
          opacity: [0, 1, 0],
          y: [5, 15, 25],
          x: [0, -3, 3],
          scale: [1, 1.2, 0]
        }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
      />
    </motion.div>
  );
};

export { Chat };