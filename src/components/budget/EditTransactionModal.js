import React, { useEffect, useState } from "react";
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

  const formatDate = (date) => {
    const [month, day, year] = date.split("/");
    const formattedMonth = month.padStart(2, "0");
    const formattedDay = day.padStart(2, "0");
    return `${formattedMonth}/${formattedDay}/${year}`;
  };

  const [updatedTransactionDate, setTransactionDate] = useState(
    formatDate(transactionDate)
  );
  const [updatedTransactionCategory, setUpdatedTransactionCategory] =
    useState(transactionCategory);

  const [categories, setCategories] = useState([]);

  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const fetchedCategories = querySnapshot.docs.map((doc) => ({
        categoryId: doc.id,
        categoryName: doc.data().categoryName,
      }));
      setCategories(fetchedCategories);
    };

    fetchCategories();
    onOpen();
  }, [onOpen]);

  const updateTransaction = async (id) => { // Async function used to edit a transaction's fields in the database
    if ( // If any transaction fields are undefined, the client is informed (lines 143-150) and the execution of updateTransaction is terminated (in line 151) 
      // If all fields are defined, then input validation starts from line 83
      updatedTransactionAmount !== undefined &&
      updatedTransactionDate !== undefined &&
      updatedTransactionName !== undefined &&
      updatedTransactionCategory !== undefined
    ) {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/; // Used to check the format of the updated date the client has inputted

      if (!dateRegex.test(updatedTransactionDate)) { // If the new date doesn't follow the format specified by the dateRegex (should be MM/DD/YYYY), the client is informed (lines 87-95) and the execution of
         // updateTransaction is terminated (in line 96)
        toast({
          title: "Oops!",
          description:
            "Please enter the transaction date in MM/DD/YYYY format.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          variant: "left-accent",
        });
        return;
      }

      if (updatedTransactionName.length > 20) { // If the new transaction name is longer than 20 characters, then the client is informed (lines 102-109) and the execution of updateTransaction is terminated (in line 110)
        toast({
          title: "Oops!",
          description:
            "The transaction's name should not exceed 20 characters.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          variant: "left-accent",
        });
        return;
      }

      const transactionDoc = doc(db, "transactions", id); // The specific transaction doc that the client is editing - it is used in the updateDoc function in the try block below

      try { // updateDoc Firestore function is executed within this try block after the client's inputs are validated and the catch block executes in the event of an error
        await updateDoc(transactionDoc, {
          amount: parseFloat(updatedTransactionAmount),
          dateAdded: Timestamp.fromDate(new Date(updatedTransactionDate)),
          transactionName: updatedTransactionName,
          categoryId: updatedTransactionCategory,
        });
        toast({
          title: "Success!",
          description: "Transaction updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          variant: "left-accent",
        });
        closeModal();
      } catch (error) {
        console.error("Error updating transaction:", error);
        toast({
          title: "Uh oh!",
          description:
            "An error occurred in updating the transaction, please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "left-accent",
        });
      }
    } else { // Executes if any of the fields are empty (undefined)
      toast({ // The client is informed to fill out all the fields (lines 146-153) and the execution of updateTransaction is terminated (in line 154)
        title: "Oops!",
        description: "Please fill out all the fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      return;
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = categories.find(
      (category) => category.categoryId === event.target.value
    );
    setUpdatedTransactionCategory(
      selectedCategory ? selectedCategory.categoryId : ""
    );
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
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="transaction_date">Date Added</FormLabel>
                <Input
                  id="transaction_date"
                  type="text"
                  placeholder="Enter date (MM/DD/YYYY)"
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
