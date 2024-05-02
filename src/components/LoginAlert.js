import React, { useState, useEffect } from "react";
import "../styles/stylesheet.css";
import { Alert, AlertIcon } from "@chakra-ui/react";

const LoginAlert = ({ isLoggedIn, message }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, message]);

  if (!showMessage) return null;

  return (
    <div className="alert-container">
      <Alert status={isLoggedIn ? "success" : "error"}>
        <AlertIcon />
        {isLoggedIn ? "Successful! Please wait..." : message}
      </Alert>
    </div>
  );
};

export default LoginAlert;
