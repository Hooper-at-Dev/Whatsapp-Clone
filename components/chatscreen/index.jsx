import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDown,
  ChevronDown,
  Paperclip,
  User,
  Smile,
  Lock,
  Mic,
  Send
} from 'lucide-react';
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import { Picker } from "emoji-mart";
import firebase from "firebase";
import { useEffect, useRef, useState } from "react";
import getRecipientEmail from "../../utils/getRecipientEmail";
import Timeago from "react-timeago";

// Animation variants for chat messages
const messageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }
};

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

function Chatscreen({ chat, messages, onHeaderClick }) {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const endOfMessagesRef = useRef(null);

  // Animation variants for the component
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.1 }
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

  const inputVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
    }
  };

  const messageContainerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.3 }
    }
  };

  // Handle loading, error, and user states
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-purple-500/50 border-t-blue-400 rounded-full"
      />
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-lg p-6 rounded-2xl text-slate-200 border border-slate-600/50 shadow-lg">
        Error: {error.message}
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900">
      <div className="bg-slate-800/80 backdrop-blur-lg p-6 rounded-2xl text-slate-200 border border-slate-600/50 shadow-lg">
        Please log in
      </div>
    </div>
  );

  // Log chat for debugging
  console.log("Chatscreen chat prop:", chat);

  // Ensure chat.users is valid before proceeding
  if (!chat || !chat.users || !Array.isArray(chat.users)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900">
        <div className="bg-slate-800/80 backdrop-blur-lg p-6 rounded-2xl text-slate-200 border border-slate-600/50 shadow-lg max-w-md">
          Error: Invalid chat data. Chat object: {JSON.stringify(chat, null, 2)}
        </div>
      </div>
    );
  }

  const recipientEmail = getRecipientEmail(chat.users, user);

  // Only query recipient if recipientEmail is valid
  const [recipientSnapshot] = useCollection(
    recipientEmail
      ? db.collection("users").where("email", "==", recipientEmail)
      : null
  );
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(chat.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesSnapshot]);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.email,
      message: input,
      photoURL: user.photoURL,
      receiverHasRead: false,
    });

    setInput("");
    scrollToBottom();
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs?.map((message) => {
        const messageData = message.data();
        const isUser = messageData.user === user.email;
        return (
          <motion.div
            key={message.id}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg p-4 rounded-2xl shadow-xl backdrop-blur-sm border ${
                isUser
                  ? 'bg-gradient-to-r from-purple-500/80 via-blue-500/80 to-emerald-500/80 text-white border-purple-400/30'
                  : 'bg-slate-800/60 text-slate-200 border-slate-600/40'
              }`}
              style={{
                backdropFilter: 'blur(10px)',
              }}
            >
              <p className="text-sm font-medium">{messageData.message}</p>
              {messageData.timestamp && (
                <p className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-slate-400'}`}>
                  <Timeago date={messageData.timestamp.toDate()} />
                </p>
              )}
            </div>
          </motion.div>
        );
      });
    } else {
      return (
        <div className="flex justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-purple-500/50 border-t-blue-400 rounded-full"
          />
        </div>
      );
    }
  };

  return (
    <motion.div 
      className="main-container min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 relative font-mono overflow-hidden flex flex-col"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 25%, rgba(147, 51, 234, 0.08) 0.3%, transparent 2%),
          radial-gradient(circle at 85% 75%, rgba(59, 130, 246, 0.06) 0.3%, transparent 2%),
          radial-gradient(circle at 45% 45%, rgba(236, 72, 153, 0.04) 0.3%, transparent 2%),
          radial-gradient(circle at 25% 85%, rgba(16, 185, 129, 0.05) 0.3%, transparent 2%),
          linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.9) 100%)
        `,
        backdropFilter: 'blur(10px)',
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-16 left-16 w-32 h-32 bg-purple-500/8 rounded-full blur-3xl"
        animate={{
          y: [-12, 12, -12],
          x: [-8, 8, -8],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-32 right-16 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          y: [12, -12, 12],
          x: [8, -8, 8],
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
        className="absolute top-1/2 right-8 w-24 h-24 bg-emerald-500/6 rounded-full blur-2xl"
        animate={{
          y: [-8, 8, -8],
          x: [-4, 4, -4],
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
      {[...Array(25)].map((_, i) => (
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

      {/* Fixed Header */}
      <motion.div 
        className="cursor-pointer header sticky top-0 left-0 right-0 z-50 mx-5 lg:mx-8 mt-4 flex items-center p-5 h-20 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl hover:bg-slate-800/50 transition-all duration-300"
        variants={headerVariants}
        onClick={onHeaderClick}
        style={{
          backdropFilter: 'blur(12px)',
        }}
      >
        {recipient ? (
          <motion.div 
            className="header__recipient-avatar"
            variants={avatarVariants}
            whileHover="hover"
          >
            <div className="w-12 h-12 rounded-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 rounded-full p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-full overflow-hidden">
                  <img
                    src={recipient?.photoURL}
                    alt={recipientEmail + "'s" + " Avatar"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Online indicator */}
              <motion.div
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg shadow-emerald-400/50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="header__recipient-avatar"
            variants={avatarVariants}
            whileHover="hover"
          >
            <div className="w-12 h-12 rounded-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 rounded-full p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-200">
                    {recipientEmail ? recipientEmail[0].toUpperCase() : "?"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="header__information ml-4 flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-1 text-slate-100">
            {recipient ? recipient.username : recipientEmail || "Unknown"}
          </h3>
          {recipientSnapshot ? (
            recipient?.lastSeen?.toDate() ? (
              <p className="text-sm text-slate-400">
                Last active: <Timeago date={recipient?.lastSeen?.toDate()} />
              </p>
            ) : (
              <p className="text-sm text-slate-400">
                Last active: Unavailable
              </p>
            )
          ) : (
            <p className="text-sm text-slate-400">Loading...</p>
          )}
        </motion.div>
        
        <motion.div 
          className="header__icons flex space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.button 
            className="p-2.5 rounded-full bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <User className="w-5 h-5 text-slate-300" />
          </motion.button>
          <motion.button
            className="p-2.5 rounded-full bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 shadow-lg"
            type="button"
            onClick={scrollToBottom}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ArrowDown className="w-5 h-5 text-slate-300" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Messages Container */}
      <motion.div 
        className="message-container flex-1 p-8 px-5 lg:px-8 pt-8 pb-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600/40 scrollbar-track-transparent"
        variants={messageContainerVariants}
      >
        {/* End-to-end encryption notice */}
        <motion.div
          className="end-to-end-notification p-4 rounded-2xl mx-auto max-w-lg mb-6 bg-slate-800/60 backdrop-blur-lg border border-slate-600/40 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center text-slate-200">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Lock className="w-6 h-6 mr-3 text-emerald-400 shadow-lg shadow-emerald-400/50" />
            </motion.div>
            <p className="text-sm font-medium">
              Messages are end-to-end encrypted. No one outside of this chat can read or listen to them.
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {showMessages()}
        </AnimatePresence>
        <div
          className="message-container__end-of-message mt-16 float-left clear-both"
          ref={endOfMessagesRef}
        />
      </motion.div>

      {/* Fixed Input Container (Bottom Center) */}
      <motion.form 
        className="input-container fixed bottom-0 left-0 right-0 z-50 p-4 mx-5 lg:mx-8 mb-4"
        variants={inputVariants}
        onSubmit={sendMessage}
      >
        <div className="max-w-4xl mx-auto bg-slate-800/60 backdrop-blur-xl border border-slate-600/40 rounded-2xl shadow-2xl p-4 ml-80"
             style={{ backdropFilter: 'blur(12px)' }}>
          <AnimatePresence>
            {emojiPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute bottom-full left-4 mb-2"
              >
                <Picker
                  title=""
                  emoji=""
                  set="facebook"
                  onSelect={(emoji) => {
                    setInput(input + emoji.native);
                    setEmojiPickerOpen(false);
                  }}
                  color="#8b5cf6"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center space-x-3">
            <motion.button
              type="button"
              onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
              className="p-3 rounded-full bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Smile className="w-5 h-5 text-slate-300" />
            </motion.button>
            
            <motion.button
              type="button"
              className="p-3 rounded-full bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Paperclip className="w-5 h-5 text-slate-300" />
            </motion.button>

            <motion.input
              type="text"
              className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-2xl px-6 py-3.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 shadow-inner"
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                setEmojiPickerOpen(false);
                setIsInputFocused(true);
              }}
              onBlur={() => setIsInputFocused(false)}
              animate={isInputFocused ? { scale: 1.02 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ backdropFilter: 'blur(8px)' }}
            />

            <AnimatePresence>
              {input && (
                <motion.button
                  type="submit"
                  className="p-3 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 hover:from-purple-600 hover:via-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </AnimatePresence>

            {!input && (
              <motion.button
                type="button"
                className="p-3 rounded-full bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/30 shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Mic className="w-5 h-5 text-slate-300" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.form>

      {/* Enhanced floating decorative elements */}
      <motion.div
        className="absolute top-32 right-12 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/60"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.4, 1, 0.4],
          x: [0, 8, 0],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute bottom-40 left-12 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/60"
        animate={{
          scale: [1, 2.2, 1],
          opacity: [0.3, 1, 0.3],
          x: [0, -8, 0],
          y: [0, 8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 1.2
        }}
      />
      <motion.div
        className="absolute top-2/3 right-20 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/60"
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
    </motion.div>
  );
}

export { Chatscreen as ChatScreen };