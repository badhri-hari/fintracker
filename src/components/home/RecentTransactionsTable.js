import React, { useState, useEffect, useContext, useRef } from "react";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  Heading,
  Button,
  Flex,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../settings/ThemeContext";

export default function HomeTable() {
  const { colorMode } = useContext(ThemeContext);

  const [transactions, setTransactions] = useState([]);
  const [categoriesArray, setCategoriesArray] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const tableRef = useRef(null);

  const toggleTransactions = () => {
    setShowTransactions(!showTransactions);
    if (!showTransactions) {
      setTimeout(() => {
        tableRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const unsubscribeCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const categoriesArray = {};
        snapshot.forEach((doc) => {
          categoriesArray[doc.id] = doc.data().categoryName;
        });
        setCategoriesArray(categoriesArray);
      }
    );

    return () => unsubscribeCategories();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userID || Object.keys(categoriesArray).length === 0) return;

    setIsLoading(true);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("userId", "==", userID),
      orderBy("dateAdded", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const transactionsWithCategoryNames = snapshot.docs.map((doc) => ({
          ...doc.data(),
          categoryName: categoriesArray[doc.data().categoryId],
          dateAdded: doc.data().dateAdded.toDate(),
        }));
        setTransactions(transactionsWithCategoryNames);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions: ", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userID, categoriesArray]);

  function formatAmount(amount) {
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

    let color;
    if (colorMode === "dark") {
      color = amount < 0 ? "#ff6347" : "white";
    } else {
      color = amount < 0 ? "red" : "green";
    }

    return <span style={{ color }}>{formattedAmount}</span>;
  }

  return (
    <>
      <Flex justifyContent="center" mt={4}>
        <Button onClick={toggleTransactions}>
          {showTransactions
            ? "Hide Recent Transactions"
            : "Show Recent Transactions"}
        </Button>
      </Flex>
      <AnimatePresence>
        {showTransactions && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.2 }}
            ref={tableRef}
          >
            <Heading as="h2" size="xl" textAlign="center" my={6}>
              Recent Transactions
            </Heading>
            <TableContainer>
              {isLoading ? (
                <div
                  style={{
                    borderRadius: "20%",
                    width: "98%",
                    margin: "0 auto",
                  }}
                >
                  <Skeleton height="300px" fadeDuration={1} />
                </div>
              ) : (
                <Table variant="striped" colorScheme="whatsapp">
                  <Thead>
                    <Tr>
                      <Th>Transaction</Th>
                      <Th>Date Added</Th>
                      <Th>Category</Th>
                      <Th>Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {transactions.map((transaction) => (
                      <Tr key={transaction.id}>
                        <Td>{transaction.transactionName}</Td>
                        <Td>{transaction.dateAdded.toLocaleDateString()}</Td>
                        <Td>{transaction.categoryName}</Td>
                        <Td>{formatAmount(transaction.amount)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TableContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
