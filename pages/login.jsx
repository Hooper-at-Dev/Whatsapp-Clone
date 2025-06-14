import Head from "next/head";
import { auth, googleProvider, githubProvider } from "../firebase";
import { motion } from "framer-motion";
import Image from "next/image";
import ChatLogo from "../components/ChatLogo";

const Login = () => {
  const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider).catch(alert);
  };

  const signInWithGithub = () => {
    auth.signInWithPopup(githubProvider).catch(alert);
  };

  return (
    <section className="min-h-screen bg-gradient-to-tr from-indigo-500 via-pink-500 to-yellow-500 flex flex-col items-center justify-center text-white font-sans">
      <Head>
        <title>Login | ChatHub</title>
        <link rel="icon" href="/custom-logo.png" />
      </Head>

      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="mb-8"
      >
        <ChatLogo />
      </motion.div>

      {/* Animated Buttons Container */}
      <motion.div
        className="flex flex-col items-center space-y-4 bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-pulse drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          Welcome to <span className="underline decoration-wavy decoration-4 decoration-fuchsia-500">ChatHub</span> 🚀
        </motion.h1>


        <div className="flex flex-col items-center space-y-4 w-full">
          {/* Google Button */}
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-3 w-full justify-center text-indigo-700 bg-white font-semibold py-2.5 px-6 rounded-full shadow-md border border-indigo-300 hover:bg-gradient-to-r hover:from-yellow-200 hover:to-pink-200 hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* GitHub Button */}
          <button
            onClick={signInWithGithub}
            className="flex items-center gap-3 w-full justify-center bg-black text-white font-semibold py-2.5 px-6 rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub logo"
              className="w-5 h-5 invert"
            />
            Sign in with GitHub
          </button>
        </div>

      </motion.div>

      {/* Footer Section */}
      <motion.div
        className="mt-10 text-center px-4 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="border-t border-white/40 mt-6 mb-4"></div>
        <p className="text-lg font-semibold">About the Developer</p>
        <ul className="text-sm mt-2 text-white/80 space-y-1">
          <li>
            This is <strong>not</strong> a production version. It’s a fun project to sharpn my skills.
          </li>
        </ul>
      </motion.div>

      <p className="fixed bottom-2 left-2 text-sm text-white/60">
        &copy; {new Date().getFullYear()}
      </p>
    </section>
  );
};

export default Login;
