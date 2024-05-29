import { useEffect, useState } from "react";
import {
  NumberInput,
  NumberInputField,
  Input,
  Button,
  HStack,
  VStack,
  Select,
  useToast,
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

export default function IncomeForm() {
  const userId = auth?.currentUser?.uid;

  const [income, setIncome] = useState(0);
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

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const onSubmitIncome = async () => {
    if (!income || !transactionName || !transactionCategory) {
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

    if (income > 100000) {
      toast({
        title: "Oops!",
        description: "Income cannot be greater than 1,00,000.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      return;
    }

    try {
      await addDoc(transactionsCollectionReference, {
        transactionName: transactionName, // Name of transaction
        amount: income, // The amount of income specified
        categoryId: transactionCategory, // The category ID that the transaction belongs in
        dateAdded: new Date(), // The date and time when the transaction was added
        userId: userId, // User ID
      });

      toast({
        title: "Success!",
        description: "Income added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    } catch (error) {
      console.error("Error adding document:", error); // Displays an error message in the console
      toast({
        title: "Uh oh!",
        description:
          "An error occurred in adding the income, please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
    }
  };

  const format = (val) =>
    isNaN(val) || val === 0 ? `₹0` : `₹${val.toLocaleString()}`;
  const parse = (val) => parseFloat(val.replace(/₹/g, "").replace(/,/g, ""));

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setTransactionCategory(selectedCategoryId);
    if (selectedCategoryId === "add-new-category") {
      navigate("/settings");
    }
  };

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
          placeholder="Income Name"
          value={transactionName}
          onChange={(e) => setTransactionName(e.target.value)}
        />
        <NumberInput
          onChange={(onNumericChange) => setIncome(parse(onNumericChange))}
          value={format(income)}
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
          colorScheme="teal"
          variant="outline"
          onClick={onSubmitIncome}
        >
          Add Income to Budget
        </Button>
      </VStack>
    </div>
  );
}
