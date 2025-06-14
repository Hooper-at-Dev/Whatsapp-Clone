"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const NewChat = ({ onInputChange, onInputConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsTyping(e.target.value.length > 0);
    if (onInputChange) onInputChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onInputConfirm) onInputConfirm();
    window.location.hash = '';
  };

  // Enhanced animation variants
  const modalVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: -15
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      rotateX: 15,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: Math.random() * 2
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div id="new" className="modal">
      <motion.div 
        className="modal-box relative overflow-hidden bg-gradient-to-br from-pink-600/95 via-purple-700/95 to-indigo-600/95 backdrop-blur-2xl border-2 border-white/20 shadow-2xl rounded-3xl max-w-lg"
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Enhanced animated background overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-indigo-500/30"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(147, 51, 234, 0.3), rgba(99, 102, 241, 0.3))",
              "linear-gradient(90deg, rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3), rgba(147, 51, 234, 0.3))",
              "linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3))"
            ]
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Enhanced Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 shadow-2xl relative overflow-hidden"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Sparkle effects on icon */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full"
                variants={sparkleVariants}
                animate="animate"
              />
              <motion.div
                className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white rounded-full"
                variants={sparkleVariants}
                animate="animate"
                style={{ animationDelay: '1s' }}
              />
              
              <motion.svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </motion.svg>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold text-white mb-3 drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              ✨ Start New Chat
            </motion.h2>
            
            <motion.p 
              className="text-white/80 text-base font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Enter the email address of the person you'd like to chat with 💬
            </motion.p>
          </motion.div>

          {/* Enhanced Input Section */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="relative">
              <motion.input
                type="email"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="user@example.com ✉️"
                className="w-full px-6 py-5 bg-white/15 backdrop-blur-lg border-2 border-white/30 rounded-2xl text-black placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-400/50 transition-all duration-300 text-lg font-medium shadow-inner"
                whileFocus={{ 
                  scale: 1.02,
                  borderColor: "rgba(236, 72, 153, 0.6)"
                }}
                style={{ backdropFilter: 'blur(15px)' }}
              />
              
              {/* Enhanced typing indicator */}
              {isTyping && (
                <motion.div 
                  className="absolute right-5 top-1/2 transform -translate-y-1/2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="flex space-x-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Enhanced Modal Actions */}
          <motion.div 
            className="modal-action flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.a
              href="#"
              className={`btn flex-1 border-0 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                inputValue.trim()
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 shadow-2xl'
                  : 'bg-white/20 cursor-not-allowed opacity-60'
              }`}
              onClick={handleSubmit}
              variants={buttonVariants}
              whileHover={inputValue.trim() ? "hover" : {}}
              whileTap={inputValue.trim() ? "tap" : {}}
            >
              {/* Button sparkle effect */}
              {inputValue.trim() && (
                <>
                  <motion.div
                    className="absolute top-2 right-3 w-2 h-2 bg-yellow-300 rounded-full"
                    variants={sparkleVariants}
                    animate="animate"
                  />
                  <motion.div
                    className="absolute bottom-2 left-3 w-1.5 h-1.5 bg-white rounded-full"
                    variants={sparkleVariants}
                    animate="animate"
                    style={{ animationDelay: '0.7s' }}
                  />
                </>
              )}
              
              <motion.svg 
                className="w-6 h-6 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={inputValue.trim() ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </motion.svg>
              Start Chat
            </motion.a>
            
            <motion.a 
              href="#" 
              className="btn bg-white/15 hover:bg-white/25 border-2 border-white/30 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 backdrop-blur-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              style={{ backdropFilter: 'blur(15px)' }}
            >
              ❌ Cancel
            </motion.a>
          </motion.div>
        </div>

        {/* Enhanced decorative elements */}
        <motion.div 
          className="absolute top-6 right-6 w-3 h-3 bg-yellow-300 rounded-full shadow-lg"
          variants={sparkleVariants}
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-6 left-6 w-2 h-2 bg-pink-300 rounded-full shadow-lg"
          variants={sparkleVariants}
          animate="animate"
          style={{ animationDelay: '1.5s' }}
        />
        
        {/* Enhanced floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                ['bg-pink-400/30', 'bg-purple-400/30', 'bg-indigo-400/30', 'bg-yellow-400/30', 
                 'bg-green-400/30', 'bg-blue-400/30', 'bg-orange-400/30', 'bg-red-400/30'][i]
              }`}
              style={{
                width: Math.random() * 6 + 3 + 'px',
                height: Math.random() * 6 + 3 + 'px',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              variants={floatingVariants}
              animate="float"
              transition={{ delay: i * 0.3 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export { NewChat };
