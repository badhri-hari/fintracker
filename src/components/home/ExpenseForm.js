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
  const [transactionRepeatPeriod, setTransactionRepeatPeriod] = useState("");
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
        transactionName: transactionName,
        amount: -expense,
        categoryId: transactionCategory,
        dateAdded: new Date(),
        userId: userId,
      });
      toast({
        title: "Success!",
        description: "Expense added successfully.",
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
          "An error occurred in adding the expense, please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
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

  const handleRecurringTransaction = (event) => {
    setTransactionRepeatPeriod(event.target.value);
  };

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
            width="50%"
          >
            {userCategories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
            <option value="add-new-category">+ Add a New Category</option>
          </Select>
          <Select
            variant="outline"
            placeholder="One time"
            onChange={handleRecurringTransaction}
            value={transactionRepeatPeriod}
            width="50%"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
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
