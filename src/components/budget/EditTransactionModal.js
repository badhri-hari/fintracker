import React, { useEffect, useState, useContext } from "react";
import { db } from "../../config/firebase";
import {
  doc,
  Timestamp,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Select,
} from "@chakra-ui/react";

import { ThemeContext } from "../settings/ThemeContext";

export default function DeleteTransactionConfirmationModal({
  transactionId,
  transactionRecordName,
  transactionAmount,
  transactionDate,
  transactionCategory,
  onClose,
}) {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const [updatedTransactionName, setTransactionName] = useState(
    transactionRecordName
  );
  const [updatedTransactionAmount, setTransactionAmount] =
    useState(transactionAmount);
  const [updatedTransactionDate, setTransactionDate] =
    useState(transactionDate);
  const [updatedTransactionCategory, setUpdatedTransactionCategory] =
    useState(transactionCategory);

  const [categories, setCategories] = useState([]);

  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const fetchedCategories = querySnapshot.docs.map(
        (doc) => doc.data().name
      );
      setCategories(fetchedCategories);
    };

    fetchCategories();
    onOpen();
  }, [onOpen]);

  const updateTransaction = async (id) => {
    if (
      updatedTransactionAmount !== undefined &&
      updatedTransactionDate !== undefined &&
      updatedTransactionName !== undefined &&
      updatedTransactionCategory !== undefined
    ) {
      const transactionDoc = doc(db, "transactions", id);
      await updateDoc(transactionDoc, {
        amount: parseFloat(updatedTransactionAmount),
        dateAdded: Timestamp.fromDate(new Date(updatedTransactionDate)),
        name: updatedTransactionName,
        category: updatedTransactionCategory,
      });
      closeModal();
    } else {
      toast({
        title: "Oops!",
        description: "Please fill out all the fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setUpdatedTransactionCategory(value);
  };

  const { colorMode } = useContext(ThemeContext);

  return (
    <AlertDialog isOpen={isOpen} onClose={closeModal}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
            fontSize="lg"
            fontWeight="bold"
          >
            Editing Transaction:
          </AlertDialogHeader>

          <AlertDialogBody
            bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
          >
            <VStack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="transaction_name">Name</FormLabel>
                <Input
                  id="transaction_name"
                  type="text"
                  placeholder="Enter name"
                  value={updatedTransactionName}
                  onChange={(e) => setTransactionName(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="transaction_amount">Amount</FormLabel>
                <Input
                  id="transaction_amount"
                  type="number"
                  placeholder="Enter amount"
                  value={updatedTransactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="transaction_category">Category</FormLabel>
                <Select
                  id="transaction_category"
                  placeholder="Select Category"
                  onChange={handleCategoryChange}
                  value={updatedTransactionCategory}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="transaction_date">Date Added</FormLabel>
                <Input
                  id="transaction_date"
                  type="text"
                  placeholder="Enter date"
                  value={updatedTransactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </FormControl>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter
            bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "white"}`}
          >
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => updateTransaction(transactionId)}
            >
              Update
            </Button>
            <Button colorScheme="blue" ml={3} onClick={closeModal}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
