import { useEffect, useState } from "react";
import {
  NumberInput,
  NumberInputField,
  Input,
  Button,
  VStack,
  Select,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase.js";
import { useNavigate } from "react-router-dom";

export default function ExpenseForm() {
  const userId = auth?.currentUser?.uid;

  const [expense, setExpense] = useState(0);
  const [transactionName, setTransactionName] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [userCategories, setUserCategories] = useState([]);
  const navigate = useNavigate();

  const transactionsCollectionReference = collection(db, "transactions");

  const toast = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const categoriesQuery = query(
      collection(db, "categories"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      const updatedCategories = snapshot.docs.map((doc) => ({
        categoryName: doc.data().categoryName,
        categoryId: doc.id,
      }));
      setUserCategories(updatedCategories);
    });

    return () => unsubscribe();
  }, [userId]);

  const onSubmitExpense = async () => {
    // Defining an async function for adding a new expense
    if (!expense || !transactionName || !transactionCategory) {
      toast({
        title: "Oops!",
        description: "Please fill out all the fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      return;
    }

    if (transactionName.length > 20) {
      toast({
        title: "Oops!",
        description:
          "The transaction's name cannot be more than 20 characters.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      return;
    }

    if (expense > 100000) {
      toast({
        title: "Oops!",
        description: "Expense cannot be greater than 1,00,000.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      return;
    }

    try {
      await addDoc(transactionsCollectionReference, {
        // 'await' is used inside an async function which pauses the function's execution until addDoc completes
        transactionName: transactionName,
        amount: -expense, // Expenses will have negative amounts
        categoryId: transactionCategory,
        dateAdded: new Date(),
        userId: userId,
      }); // addDoc function tries adding a new expense to the database
      toast({
        // Message for the client regarding the status of the insertion of the new expense into the database
        title: "Success!", // Indicates to the client that the insertion of the expense to the database was successful
        description: "Expense added successfully.",
        status: "success", // For styling purposes
        duration: 5000, // Message displays for 5000 milliseconds (5 seconds)
        isClosable: true, // Message can be closed by the client before the 5 second limit is over
        variant: "left-accent", // For styling purposes
      }); // Success alert if new expense created successfully
    } catch (error) {
      // Stops the execution of the 'try' block in the event of an error in creating the expense
      console.error("Error adding document: ", error); // Logs error into console for troubleshooting
      toast({
        // Message for the client regarding the status of the insertion of the new expense into the database
        title: "Uh oh!", // Indicates to the client that the insertion of the expense to the database was unsuccessful
        description:
          "An error occurred in adding the expense, please try again later.",
        status: "error", // For styling purposes
        duration: 5000,
        isClosable: true, // Message can be closed by the client before the 5 second limit is over
        variant: "left-accent", // For styling purposes
      }); // Error alert if new expense creation was unsuccessful
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setTransactionCategory(selectedCategoryId);
    if (selectedCategoryId === "add-new-category") {
      navigate("/settings");
    }
  };

  const format = (val) => {
    if (isNaN(val) || val === 0) {
      // eslint-disable-next-line no-useless-concat
      return `₹` + "0"; // Return an empty string for NaN or 0 values
    }
    return `₹` + val.toLocaleString();
  };

  const parse = (val) => {
    // Remove the ₹ sign and commas, then parse it as a float
    return parseFloat(val.replace(/₹/g, "").replace(/,/g, ""));
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div
      className={`transactionform-fade-enter ${
        isMounted ? "transactionform-fade-enter-active" : ""
      }`}
    >
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="Expense Name"
          value={transactionName}
          onChange={(e) => setTransactionName(e.target.value)}
        />
        <NumberInput
          onChange={(onNumericChange) => setExpense(parse(onNumericChange))}
          value={format(expense)}
          precision={2}
        >
          <NumberInputField width={"100%"} />
        </NumberInput>

        <HStack>
          <Select
            variant="outline"
            placeholder="Select Category"
            onChange={handleCategoryChange}
            value={transactionCategory}
            width="100%"
          >
            {userCategories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
            <option value="add-new-category">+ Add a New Category</option>
          </Select>
        </HStack>

        <Button
          rightIcon={<IoIosAddCircleOutline />}
          colorScheme="red"
          variant="outline"
          onClick={onSubmitExpense}
        >
          Add Expense to Budget
        </Button>
      </VStack>
    </div>
  );
}
