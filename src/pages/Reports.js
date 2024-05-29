import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { Heading, HStack, Divider, Select, Flex } from "@chakra-ui/react";

import MonthlyIncomeGraph from "./../components/reports/MonthlyIncomeGraph";
import MonthlyExpenseGraph from "../components/reports/MonthlyExpenseGraph";
import MonthlyIncomePiechart from "../components/reports/MonthlyIncomePiechart";
import MonthlyExpensePiechart from "../components/reports/MonthlyExpensePiechart";
import MonthlyBalanceGraph from "../components/reports/MonthlyBalanceGraph";

export default function Reports() {
  const navigate = useNavigate();
  const transactionsRef = collection(db, "transactions");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shouldAnimate = searchParams.get("animate");

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // React hook that runs when the page renders.
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If user not signed in
        navigate("/");
      }
    });

    return () => {
      // Cleanup function
      unsubscribeAuth();
    };
  }, [navigate]);

  useEffect(() => {
    getDocs(transactionsRef)
      .then((snapshot) => {
        const years = new Set();
        snapshot.docs.forEach((doc) => {
          const year = doc.data().dateAdded.toDate().getFullYear();
          years.add(year);
        });
        setAvailableYears([...years].sort());
      })
      .catch((error) => console.error("Error fetching documents: ", error));
  }, [transactionsRef]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <>
      <Heading as="h2" size="xl" ml="20px" mt="18px" mb="18px">
        Your Reports
      </Heading>
      <Divider />
      <Flex justifyContent="center" width="100%" pt="3vh">
        <Select
          onChange={handleYearChange}
          placeholder="Select year"
          defaultValue={selectedYear}
          w="85%"
        >
          {availableYears.sort().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Flex>
      <HStack
        display="flex"
        alignContent="center"
        justify="center"
        alignItems="stretch"
        w="98%"
        spacing="15px"
        // The above specified style properties for the HStack component ensure UI organization
      >
        <MonthlyIncomeGraph
          shouldAnimate={shouldAnimate === "income"} // Variable used for animating the
          // - MonthlyIncomeGraph component if the user wanted to see his monthly incomes
          year={selectedYear} // Passes the 'selectedYear' value from this page
          // - as the 'year' value to the MonthlyIncomeGraph component
          flex={1} // Ensures that each graph component occupies an equal amount of space within the HStack component
        />
        <MonthlyExpenseGraph
          shouldAnimate={shouldAnimate === "expense"} // Variable used for animating the
          // - MonthlyExpenseGraph component if the user wanted to see his monthly expenses
          year={selectedYear} // Passes the 'selectedYear' value from this page
          // - as the 'year' value to the MonthlyExpenseGraph component
          flex={1} // Ensures that each graph component occupies an equal amount of space within the HStack component
        />
        <MonthlyBalanceGraph
          shouldAnimate={shouldAnimate === "balance"} // Variable used for animating the
          // - MonthlyBalanceGraph component if the user wanted to see his monthly balances
          year={selectedYear}
          // Passes the 'selectedYear' value from this page
          // - as the 'year' value to the MonthlyBalanceGraph component
          flex={1} // Ensures that each graph component occupies an equal amount of space within the HStack component
        />
      </HStack>
      <Divider
        mb="35px"
        borderColor="gray.500"
        borderWidth="1px"
        mt="65px"
        width="95%"
        ml="2%"
      />
      <HStack
        display="flex"
        alignContent="center"
        justify="center"
        alignItems="stretch"
        w="98%"
        mb="30px"
        spacing="15px"
      >
        <MonthlyIncomePiechart flex={1} year={selectedYear} />
        <MonthlyExpensePiechart flex={1} year={selectedYear} />
      </HStack>
    </>
  );
}
