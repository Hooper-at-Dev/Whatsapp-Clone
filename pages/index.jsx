import Head from "next/head";
import { useState, useEffect } from "react"; // Add useEffect for hash handling
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { NewChat, Sidebar } from "../components";
import { auth, db } from "../firebase";
import EmailValidator from "email-validator";
import { Loader } from "../components";

const Home = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false); // State to control NewChat modal

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.email || "");
  const [chatsSnapshot] = useCollection(user ? userChatRef : null);

  // Handle URL hash to open NewChat modal
  useEffect(() => {
    if (window.location.hash === "#new") {
      setIsNewChatOpen(true);
    } else {
      setIsNewChatOpen(false);
    }
  }, [router]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>Please log in</div>;

  const createChat = () => {
    if (!input || !user) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      console.log(`Creating chat with users: [${user.email}, ${input}]`);
      db.collection("chats")
        .add({ users: [user.email, input] })
        .then((docRef) => {
          console.log(`Chat created with ID: ${docRef.id}`);
          setIsNewChatOpen(false); // Close the modal
          window.history.replaceState(null, "", "/"); // Remove #new from URL
          router.push(`/chat/${docRef.id}`); // Redirect to the new chat
        })
        .catch((error) => {
          console.error("Error creating chat:", error.message);
        });
    } else {
      console.log(`Cannot create chat. Input: ${input}, User email: ${user.email}`);
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (doc) =>
        doc.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <div className="main-container flex overflow-y-hidden">
      <Head>
        <title>WhatsApp Clone - Chats</title>
      </Head>
      <Sidebar activeChat={null} />
      <NewChat
        onInputChange={(e) => setInput(e.target.value)}
        onInputConfirm={createChat}
        hidden={!isNewChatOpen}
        onClose={() => {
          setIsNewChatOpen(false);
          window.history.replaceState(null, "", "/"); // Remove #new from URL
        }}
      />
      <div className="chat-container flex-1 flex items-center justify-center h-screen bg-chatscreen dark:bg-base-200">
        <p className="text-gray-500 dark:text-gray-300 text-lg">
          Select a chat or create a new one to start messaging.
        </p>
      </div>
    </div>
  );
};

export default Home;