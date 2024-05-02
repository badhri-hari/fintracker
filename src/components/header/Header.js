import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router-dom";
import SignOutModal from "./SignOutModal";
import { Avatar, Tooltip } from "@chakra-ui/react";

export default function Header() {

  const [photoUrl, setPhotoUrl] = useState("../styles/header-icon.png");
  const [showDefaultAvatar, setShowDefaultAvatar] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleImageError = () => {
    setShowDefaultAvatar(true);
    console.error("There was an error in showing the profile picture(s).");
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.photoURL) {
        setPhotoUrl(user.photoURL);
        setShowDefaultAvatar(false);
      }
    });

    return unsubscribe;
  }, []);

  function signOut() {
    setIsSignOutModalOpen(true);
  }

  function closeModal() {
    setIsSignOutModalOpen(false);
  }

  return (
    <>
      <header>
      <Tooltip
          hasArrow
          bg="gray.600"
          color="white"
          label="Sign out"
          openDelay={500}
          closeDelay={100}
          placement="left"
          aria-label="Tooltip to let you know that if you click on your profile picture, you can see the sign out box."
        >
          <button className="header-profile-icon-container" onClick={signOut}>
            {showDefaultAvatar ? (
              <Avatar bg="teal.500" />
            ) : (
              <img src={photoUrl} alt="Profile" onError={handleImageError} />
            )}
          </button>
        </Tooltip>

        <nav>
          <div className="pill-nav"> {/* Applies consistent styling for all buttons */}
            <NavLink to="/home" activeClassName="active">
              Home
            </NavLink>
            <NavLink to="/budget" activeClassName="active">
              Budget
            </NavLink>
            <NavLink to="/reports" activeClassName="active">
              Reports
            </NavLink>
            <NavLink to="/settings" activeClassName="active">
              Settings
            </NavLink>
          </div>
        </nav>

      </header>

      <SignOutModal isOpen={isSignOutModalOpen} onClose={closeModal} />
    </>
  );
}
