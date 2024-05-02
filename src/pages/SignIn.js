import React, { useEffect, useState } from "react";
import LoginAlert from "../components/LoginAlert";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleAuthProvider } from "../config/firebase";
import { Spinner } from "@chakra-ui/react";

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        setIsLoggedIn(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

  function googleSignIn() {
    signInWithPopup(auth, googleAuthProvider)
      .then(() => {
        setIsLoggedIn(true);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error during Google Sign In: ", error);
        setErrorMessage("An error occurred during sign up. Please try again.");
        setIsLoggedIn(false);
      });
  }

  return (
    <>
      <div className="login-screen-body">
        <div className="login-screen-logo-container">
          <img
            alt="fintracker logo"
            className="login-screen-logo"
            src={require("../styles/logo.png")}
          />
        </div>
        <div className="login-screen-button-container">
          {isLoggedIn === false ? (
            <button onClick={googleSignIn}>
              <img
                className="login-screen-button"
                alt="sign up with google button"
                src={require("../styles/google_sign_in_button.png")}
              />
            </button>
          ) : isLoggedIn === null ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              colorScheme="whatsapp"
              size="xl"
            />
          ) : null}
        </div>
        <LoginAlert isLoggedIn={isLoggedIn} message={errorMessage} />
      </div>
    </>
  );
}
