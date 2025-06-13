import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import firebase from "firebase";
import "tailwindcss/tailwind.css";
import "../styles/global.css";
import "emoji-mart/css/emoji-mart.css";
import Login from "./login";
import { Loader } from "../components";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            email: user.email,
            username: user.displayName,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL,
          },
          { merge: true }
        )
        .catch((err) => console.error("Error updating user in Firestore:", err));
    }
  }, [user]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;