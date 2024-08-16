import React, { useEffect, useContext } from "react";
import { db } from "../../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { ThemeContext } from "../settings/ThemeContext";

export default function DeleteTransactionConfirmationModal({
  transactionId,
  transactionRecordName,
  transactionDate,
  onClose,
}) {
  const { colorMode } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const deleteTransaction = async () => {
    const transactionDoc = doc(db, "transactions", transactionId);
    try {
      console.log(transactionDoc);
      await deleteDoc(transactionDoc);
      closeModal();
      toast({
        title: "Success!",
        description: "Transaction deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Uh oh!",
        description:
          "An error occurred when deleting the transaction, please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    }
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={closeModal}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
              fontSize="lg"
              fontWeight="bold"
            >
              Delete {transactionRecordName}? (Added on: {transactionDate})
            </AlertDialogHeader>
            <AlertDialogBody
              bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
            >
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter
              bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
            >
              <Button
                variant="ghost"
                colorScheme="red"
                onClick={deleteTransaction}
                mr={3}
              >
                Delete
              </Button>
              <Button colorScheme="blue" onClick={closeModal}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
