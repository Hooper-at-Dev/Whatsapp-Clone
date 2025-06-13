import {
  CodeIcon,
  HeartIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import Timeago from "react-timeago";
import FoldingCube from "better-react-spinkit/dist/FoldingCube"; // Import spinner for consistency

const UserInfo = ({ chat, onCloseButtonClick, hidden }) => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  // Handle loading, error, and user states
  if (loading) return <FoldingCube color="#25D366" size={30} />;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Please log in</div>;

  // Log chat for debugging
  console.log("UserInfo chat prop:", chat);

  // Ensure chat.users is valid
  if (!chat || !chat.users || !Array.isArray(chat.users)) {
    return (
      <div>
        Error: Invalid chat data. Chat object: {JSON.stringify(chat, null, 2)}
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
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const removeChat = () => {
    db.collection("chats").doc(chat.id).delete();
    router.push("/");
  };

  return (
    <section
      className={`z main-container h-screen transition duration-300 ease-in-out transform translate-x-full bg-gradient-to-br from-purple-600/95 via-purple-700/95 to-pink-600/95 relative overflow-hidden ${
        hidden ? "hidden" : "translate-x-0"
      }`}
    >
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-purple-500/30 animate-pulse" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-300/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
      </div>

      <div className="header bg-purple-500/20 backdrop-blur-xl sticky z-40 top-0 flex items-center p-4 h-20 border-b border-purple-300/30 shadow-lg">
        <button
          onClick={onCloseButtonClick}
          className="btn-error btn-sm text-white btn-circle btn mr-2 bg-red-500/80 hover:bg-red-600/90 border-0 backdrop-blur-sm transition-all duration-300 hover:scale-110"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <p className="font-poppins text-lg font-medium text-white">Contact Information</p>
      </div>
      
      <div className="info relative w-full h-screen z-10">
        <div className="mt-10 grid justify-center">
          {recipient ? (
            <div className="info__recipient-avatar avatar z-50 justify-center">
              <div className="w-20 h-20 ring-4 ring-purple-400/60 ring-offset-2 ring-offset-purple-600/20 rounded-full shadow-xl">
                <img
                  src={recipient?.photoURL}
                  alt={recipientEmail ? recipientEmail + "'s Avatar" : "Avatar"}
                  className="rounded-full"
                />
              </div>
            </div>
          ) : (
            <div className="info__recipient-avatar avatar placeholder justify-center">
              <div className="bg-purple-500/80 text-white w-20 h-20 ring-4 ring-purple-400/60 ring-offset-2 ring-offset-purple-600/20 rounded-full shadow-xl">
                <span className="text-2xl font-semibold">
                  {recipientEmail ? recipientEmail[0].toUpperCase() : "?"}
                </span>
              </div>
            </div>
          )}
          
          <p className="font-poppins mt-3 text-lg font-medium text-center text-white">
            {recipient ? recipient.username : recipientEmail || "Unknown"}
          </p>
          
          <p className="text-purple-200 text-center">
            {recipientSnapshot ? (
              recipient?.lastSeen?.toDate() ? (
                <p className="text-xs text-purple-200/80">
                  Last active: <Timeago date={recipient?.lastSeen?.toDate()} />
                </p>
              ) : (
                <p className="text-xs text-purple-200/80">
                  Last active: Unavailable
                </p>
              )
            ) : (
              <p className="text-xs text-purple-200/80">Loading...</p>
            )}
          </p>
          
          {recipient && recipient.email === "akshit.singla.dps@gmail.com" ? (
            <div
              className="badge flex cursor-default bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 mt-2 tooltip shadow-lg"
              data-tip="This is the official account of the developer."
            >
              <CodeIcon className="w-4 h-4 mr-1" /> Developer Team
            </div>
          ) : null}
          
          <div className="danger mt-10 grid justify-center">
            <button
              className="btn bg-red-500/80 hover:bg-red-600/90 border-0 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={removeChat}
            >
              <TrashIcon className="w-5 h-5 mr-0.5" /> Delete Chat
            </button>
          </div>
          
          <div className="border-t border-purple-300/30 my-5 mx-8"></div>
          
          <div className="developer">
            <p className="font-poppins text-center font-medium text-white">
              Developer Notes
            </p>
            <p className="text-purple-200/80 text-center text-sm">
              Its just a demo, please dont use it for any task.
              </p>
          </div>
          
          <div className="border-t border-purple-300/30 my-5 mx-8"></div>
          
          <p className="flex items-center justify-center text-white text-sm">
            Made with by SARTHAK 💻
          </p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 left-4 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
    </section>
  );
};

export { UserInfo };