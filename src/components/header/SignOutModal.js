import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  Button,
} from "@chakra-ui/react";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { ThemeContext } from "../settings/ThemeContext";

export default function SignOutModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  function signOut() {
    auth
      .signOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const { colorMode } = useContext(ThemeContext);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
          >
            Sign Out
          </ModalHeader>
          <ModalBody bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}>
            Are you sure you want to sign out?
          </ModalBody>
          <ModalBody bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}>
            <Text
              fontSize="xs"
              color="gray.500"
              bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
            >
              Currently signed in as: {auth.currentUser?.email}
            </Text>
          </ModalBody>
          <ModalFooter
            bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
          >
            <Button variant="ghost" colorScheme="red" mr={3} onClick={signOut}>
              Sign Out
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
