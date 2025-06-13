import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ChatLogo from "../ChatLogo"

const Loader = () => {
  // Animation variants for different elements
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const spinVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const orbitalVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen">
      {/* Animated gradient background with blur */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-yellow-400"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ backgroundSize: "400% 400%" }}
      />

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-pink-300/30 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-32 right-24 w-24 h-24 bg-yellow-300/30 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-10 w-16 h-16 bg-purple-300/30 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      {/* Main loader container */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Main spinning loader */}
        <div className="relative">
          {/* Outer spinning ring */}
          <motion.div
            className="w-32 h-32 border-4 border-transparent rounded-full"
            style={{
              background: 'linear-gradient(45deg, #ec4899, #f59e0b) padding-box, linear-gradient(45deg, #ec4899, #f59e0b, #ec4899) border-box'
            }}
            variants={spinVariants}
            animate="animate"
          >
            <div className="w-full h-full bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
              <ChatLogo />
            </div>
          </motion.div>

          {/* Inner pulsing core */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full shadow-2xl"
            variants={pulseVariants}
            animate="animate"
          >
            <div className="w-full h-full bg-white/30 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Orbital dots */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40"
            variants={orbitalVariants}
            animate="animate"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-pink-400 rounded-full shadow-lg" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg" />
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-lg" />
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400 rounded-full shadow-lg" />
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Loading...
          </motion.h2>
          <motion.p
            className="text-white/80 text-sm drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Preparing something amazing
          </motion.p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          className="flex space-x-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Additional decorative elements */}
      <motion.div
        className="absolute top-16 right-16 w-2 h-2 bg-yellow-300 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute bottom-20 left-16 w-1 h-1 bg-pink-300 rounded-full"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.4, 1, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1
        }}
      />
    </div>
  );
};

export { Loader };