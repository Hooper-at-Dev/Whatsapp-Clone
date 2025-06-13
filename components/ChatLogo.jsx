import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

const ChatLogo = ({ 
  size = 'lg', 
  showParticles = true, 
  glowIntensity = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48
  };

  const glowIntensities = {
    low: 'drop-shadow-sm',
    medium: 'drop-shadow-lg',
    high: 'drop-shadow-2xl'
  };

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  };

  // Pulsing glow variants
  const glowVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  };

  // Particle animation variants
  const particleVariants = {
    animate: (i) => ({
      y: [-20, -40, -20],
      x: [0, Math.sin(i) * 20, 0],
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        delay: i * 0.5,
      }
    })
  };

  // Icon rotation variants
  const iconVariants = {
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Animated particles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={particleVariants}
              animate="animate"
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Sparkles 
                size={8} 
                className="text-yellow-400 opacity-70" 
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pulsing glow background */}
      <motion.div
        variants={glowVariants}
        animate="animate"
        className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-400 rounded-full blur-md opacity-40 ${glowIntensities[glowIntensity]}`}
      />

      {/* Main floating container */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className={`relative ${sizeClasses[size]} bg-gradient-to-br from-pink-500 via-rose-500 to-yellow-500 rounded-full shadow-2xl flex items-center justify-center`}
      >
        {/* Inner glow */}
        <div className="absolute inset-0.5 bg-gradient-to-br from-pink-300 via-rose-300 to-yellow-300 rounded-full opacity-60" />
        
        {/* Chat icon */}
        <motion.div
          variants={iconVariants}
          animate="animate"
          className="relative z-10"
        >
          <MessageCircle 
            size={iconSizes[size]} 
            className="text-white drop-shadow-lg" 
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Animated dots inside the chat bubble */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="w-1 h-1 bg-white rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Orbiting elements */}
      {showParticles && (
        <>
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="relative w-full h-full">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2"
              >
                <div className="w-2 h-2 bg-pink-400 rounded-full opacity-80" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 15,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="relative w-full h-full">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 1,
                }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2"
              >
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-70" />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ChatLogo;