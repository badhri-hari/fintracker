import React, { useEffect, useContext } from "react";
import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  ModalHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { ThemeContext } from "../settings/ThemeContext";

export default function DeleteCategoryModal({
  categoryId,
  categoryName,
  onDelete,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useContext(ThemeContext);

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleDeleteClick = () => {
    onDelete(categoryId);
    onClose();
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent
            bg={colorMode === "dark" ? "rgb(32,36,44)" : "white"}
          >
            <ModalHeader
              bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
            >
              Delete category:&nbsp;<i>{categoryName}</i>?
            </ModalHeader>
            <AlertDialogBody
              bg={colorMode === "dark" ? "rgb(32,36,44)" : "white"}
            >
              Doing this will also delete all the transactions in the category.
            </AlertDialogBody>
            <AlertDialogFooter
              bg={colorMode === "dark" ? "rgb(32,36,44)" : "white"}
            >
              <Button
                variant="ghost"
                colorScheme="red"
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
              <Button onClick={onClose} colorScheme="blue" ml={3}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
