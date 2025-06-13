import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router"; // Add useRouter for redirection
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import EmailValidator from "email-validator";
import { ChatScreen, Loader, NewChat, UserInfo, Sidebar } from "../../components";

const Chat = ({ chat, messages }) => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false); // State for NewChat modal
  const [userInfoOpen, setUserInfoOpen] = useState(false);

  // Redirect to homepage if chat is invalid
  if (!chat || !chat.id) {
    router.push("/");
    return <div>Redirecting to homepage...</div>;
  }

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.email || "");
  const [chatsSnapshot] = useCollection(user ? userChatRef : null);

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
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar activeChat={chat.id} />
      <NewChat
        onInputChange={(e) => setInput(e.target.value)}
        onInputConfirm={createChat}
        hidden={!isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
      />
      <div className="chat-container flex-1 overflow-x-hidden overflow-y-scroll h-screen scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
        <ChatScreen
          chat={chat}
          messages={messages}
          onHeaderClick={() => setUserInfoOpen(!userInfoOpen)}
        />
      </div>
      <UserInfo
        chat={chat}
        onCloseButtonClick={() => setUserInfoOpen(false)}
        hidden={!userInfoOpen}
      />
    </div>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const chatId = context.query.id;

  if (!chatId) {
    console.log("No chat ID provided in URL");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const ref = db.collection("chats").doc(chatId);
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp ? messages.timestamp.toDate().getTime() : null,
    }));

  let chatRes;
  try {
    console.log(`Fetching chat with ID: ${chatId}`);
    chatRes = await ref.get();
    console.log(`Chat exists: ${chatRes.exists}`);
  } catch (error) {
    console.error("Error fetching chat:", error.message);
    return {
      notFound: true,
    };
  }

  if (!chatRes.exists) {
    console.log(`Chat with ID ${chatId} does not exist`);
    return {
      notFound: true,
    };
  }

  const chatData = chatRes.data();
  console.log(`Chat data for ID ${chatId}:`, chatData);

  if (!chatData || !chatData.users || !Array.isArray(chatData.users)) {
    console.error(`Invalid chat data for ID ${chatId}:`, chatData);
    return {
      notFound: true,
    };
  }

  const chat = {
    id: chatRes.id,
    ...chatData,
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}