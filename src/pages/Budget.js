import React, { useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  onSnapshot,
  collection,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  Box,
  Flex,
  Heading,
  Divider,
} from "@chakra-ui/react";

import { ThemeContext } from "../components/settings/ThemeContext";

import TransactionFilter from "../components/budget/TransactionFilter";
import DateFilter from "../components/budget/DateFilter";
import AmountFilter from "../components/budget/AmountFilter";
import CategoryFilter from "../components/budget/CategoryFilter";
import RecordMenu from "../components/budget/RecordMenu";

export default function Budget() {
  const { colorMode } = useContext(ThemeContext);

  const navigate = useNavigate();
  const [transactionsArray, setTransactionsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserUID, setCurrentUserUID] = useState(auth?.currentUser?.uid);
  const [categoriesMap, setCategoriesMap] = useState(new Map());
  const [transactionFilterOption, setTransactionFilterOption] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");

  if (transactionFilterOption === undefined) {
    setTransactionFilterOption("all");
  }

  useEffect(() => {
    const unsubscribeCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const categories = new Map();
        snapshot.forEach((doc) => {
          categories.set(doc.id, doc.data().categoryName);
        });
        setCategoriesMap(categories);
      }
    );

    return () => unsubscribeCategories();
  }, []);

  const startTimestamp = startDate
    ? Timestamp.fromDate(new Date(startDate))
    : null;
  const endTimestamp = endDate
    ? Timestamp.fromDate(
        new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59
        )
      )
    : null;

  const buildCombinedQuery = ( // Constant used to form and update the query function
    currentUserUID, // Client's Firebase-provided user ID for identifying work and personal accounts
    transactionFilterOption, // Filters by transaction type (income or expense)
    startTimestamp, // Allows client to filter transactions that were added after a date
    endTimestamp, // Allows client to filter transactions that were added before a date
    minAmount, // Minimum absolute value of the amount of a transaction
    maxAmount, // Maximum absolute value of the amount of a transaction
    selectedCategory // Allows filtering transactions by their category
  ) => {
    let transactionsQuery = query( // The actual query function
      collection(db, "transactions"), // Queries the 'transactions' collection in the database
      where("userId", "==", currentUserUID) // Only displays transactions which belong to the current account
    );

    if (transactionFilterOption === "income") {
      transactionsQuery = query(transactionsQuery, where("amount", ">", 0));
    } else if (transactionFilterOption === "expenses") {
      transactionsQuery = query(transactionsQuery, where("amount", "<", 0));
    }

    if (startTimestamp) {
      transactionsQuery = query(
        transactionsQuery,
        where("dateAdded", ">=", startTimestamp)
      );
    }
    if (endTimestamp) {
      transactionsQuery = query(
        transactionsQuery,
        where("dateAdded", "<=", endTimestamp)
      );
    }

    if (minAmount) {
      if (minAmount >= 0) {
        transactionsQuery = query(
          transactionsQuery,
          where("amount", ">=", minAmount)
        );
      } else if (minAmount < 0) {
        transactionsQuery = query(
          transactionsQuery,
          where("amount", "<=", minAmount)
        );
      }
    }

    if (maxAmount) {
      if (maxAmount > 0) {
        transactionsQuery = query(
          transactionsQuery,
          where("amount", "<=", maxAmount)
        );
      } else if (maxAmount < 0) {
        transactionsQuery = query(
          transactionsQuery,
          where("amount", ">=", maxAmount)
        );
      }
    }

    if (selectedCategory) {
      transactionsQuery = query(
        transactionsQuery,
        where("categoryId", "==", selectedCategory)
      );
    }

    transactionsQuery = query(
      transactionsQuery,
      orderBy("dateAdded", "desc") // Most recent transactions are placed on top
    );

    return transactionsQuery;
  };

  const updateTransactions = (query, categoriesMap) => {
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        setTransactionsArray(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            categoryName: categoriesMap.get(doc.data().categoryId),
            dateAdded: doc.data().dateAdded.toDate(),
          }))
        );
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions: ", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  };

  const handleAmountFilter = (min, max) => {
    var minNumber = parseInt(min);
    var maxNumber = parseInt(max);
    setMinAmount(minNumber);
    setMaxAmount(maxNumber);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUID(user.uid);
      } else {
        navigate("/");
      }
    });

    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (!currentUserUID || !categoriesMap.size) return;

    const initialQuery = buildCombinedQuery(
      currentUserUID,
      transactionFilterOption,
      startTimestamp,
      endTimestamp,
      minAmount,
      maxAmount,
      selectedCategory
    );
    updateTransactions(initialQuery, categoriesMap);
  }, [
    currentUserUID,
    transactionFilterOption,
    startTimestamp,
    endTimestamp,
    minAmount,
    maxAmount,
    selectedCategory,
    categoriesMap,
  ]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <Heading ml="20px" mt="18px" mb="18px">
        Your Budget
      </Heading>
      <Divider />
      <Flex gap="5" p="4" alignItems="stretch" minHeight="200px">
        <Box
          bg={`${colorMode === "dark" ? "rgb(150, 150, 150)" : "gray.50"}`}
          p="4"
          borderRadius="md"
          flex="1"
          height="full"
        >
          <TransactionFilter
            onFilterChange={(option) => setTransactionFilterOption(option)}
          />
        </Box>
        <Box
          bg={`${colorMode === "dark" ? "rgb(150, 150, 150)" : "gray.50"}`}
          p="4"
          borderRadius="md"
          flex="1"
          height="full"
        >
          <DateFilter
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Box>
        <Box
          bg={`${colorMode === "dark" ? "rgb(150, 150, 150)" : "gray.50"}`}
          p="4"
          borderRadius="md"
          flex="1"
          height="full"
        >
          <AmountFilter
            onFilterChange={(min, max) => {
              handleAmountFilter(min, max);
            }}
          />
        </Box>
        <Box
          bg={`${colorMode === "dark" ? "rgb(150, 150, 150)" : "gray.50"}`}
          p="4"
          borderRadius="md"
          flex="1"
          height="full"
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => setSelectedCategory(category)}
          />
        </Box>
      </Flex>
      <TableContainer className="no-scrollbar">
        {isLoading ? (
          <Skeleton height="300px" />
        ) : (
          <Table variant="striped" colorScheme="whatsapp">
            <Thead>
              <Tr>
                <Th>Transaction</Th>
                <Th>Date Added</Th>
                <Th>Category</Th>
                <Th>Amount</Th>
                <Th width="0%"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactionsArray.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>{transaction.transactionName}</Td>
                  <Td>{transaction.dateAdded.toLocaleDateString()}</Td>
                  <Td>{transaction.categoryName}</Td>
                  <Td>{formatAmount(transaction.amount)}</Td>
                  <Td>
                    <RecordMenu
                      transactionId={transaction.id}
                      transactionRecordName={transaction.transactionName}
                      transactionDate={transaction.dateAdded.toLocaleDateString()}
                      transactionAmount={transaction.amount}
                      transactionCategory={transaction.categoryName}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableContainer>
    </>
  );
}
