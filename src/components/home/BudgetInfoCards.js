import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
} from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import { ThemeContext } from "../settings/ThemeContext";

export default function BudgetInfoCards() {
  const { colorMode } = useContext(ThemeContext);

  const boxStyle = {
    backgroundColor: colorMode === "dark" ? "rgb(100, 100, 100)" : "white",
    boxShadow: "md",
    borderRadius: "lg",
    transition: "transform 0.3s ease-in-out",
    width: "100%",
    minHeight: "200px",
    margin: "0.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const hoveredBoxStyle = {
    ...boxStyle,
    transform: "scale(1.05)",
  };

  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(null);
  const [isIncomeHovered, setIsIncomeHovered] = useState(false);
  const [isExpenseHovered, setIsExpenseHovered] = useState(false);
  const [showIncomeTooltip, setShowIncomeTooltip] = useState(false);
  const [showExpenseTooltip, setShowExpenseTooltip] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
        const creationTime = new Date(user.metadata.creationTime).getTime();
        const lastSignInTime = new Date(user.metadata.lastSignInTime).getTime();

        if (
          creationTime === lastSignInTime ||
          lastSignInTime - creationTime < 5000
        ) {
          setShowIncomeTooltip(true);
          setShowExpenseTooltip(true);
          const timer = setTimeout(() => {
            setShowIncomeTooltip(false);
            setShowExpenseTooltip(false);
          }, 5000);

          return () => clearTimeout(timer);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getFirestore();
        const userUID = user.uid;
        const transactionsCol = collection(db, "transactions");
        const transactionsQuery = query(
          transactionsCol,
          where("userId", "==", userUID)
        );

        const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
          let income = 0;
          let expenses = 0;

          snapshot.docs.forEach((doc) => {
            const transaction = doc.data();
            if (transaction.amount > 0) {
              income += transaction.amount;
            } else {
              expenses += transaction.amount;
            }
          });

          setTotalIncome(income);
          setTotalExpenses(Math.abs(expenses));
        });

        return () => unsubscribe();
      }
    });
  }, []);

  useEffect(() => {
    const date = new Date();
    setMonth(date.toLocaleString("default", { month: "short" }));
    setYear(date.getFullYear());
  }, []);

  const handleIncomeClick = () => {
    setActiveForm(activeForm === "income" ? null : "income");
  };
  const handleExpenseClick = () => {
    setActiveForm(activeForm === "expense" ? null : "expense");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };
  const formattedTotalIncome = formatCurrency(totalIncome);
  const formattedTotalExpense = formatCurrency(totalExpenses);
  const formattedBalance = formatCurrency(totalIncome - totalExpenses);

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 3 }}
      spacing={6}
      templateColumns={{ md: "repeat(3, 1fr)" }}
      justifyContent="center"
      mx="auto"
      p={6}
      sx={{
        width: "calc(90%)",
      }}
    >
      <button
        onMouseOver={() => setIsIncomeHovered(true)}
        onMouseOut={() => setIsIncomeHovered(false)}
        onClick={handleIncomeClick}
      >
        <Tooltip
          isOpen={showIncomeTooltip || isIncomeHovered}
          hasArrow
          bg="gray.600"
          color="white"
          label="Click on me to add an income!"
          openDelay={500}
          closeDelay={200}
          placement="bottom"
          aria-label="Tooltip to let you know that if you click on this income box, you can access the income form and add an income."
        >
          <Box
            {...(isIncomeHovered ? hoveredBoxStyle : boxStyle)}
            gridColumn={activeForm === "income" ? "1 / 3" : "1 / 2"}
            onMouseOver={() => setIsIncomeHovered(true)}
            onMouseOut={() => setIsIncomeHovered(false)}
            onClick={handleIncomeClick}
            className="arrow-container"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <Stat>
              <StatLabel fontSize="lg" pt={12}>
                Incomes | {month} {year}
              </StatLabel>
              <StatNumber fontSize="2xl">{formattedTotalIncome}</StatNumber>
              <Link to="/reports?animate=income">
                <StatHelpText
                  fontSize="md"
                  style={{ fontWeight: "600", marginTop: "5px" }}
                >
                  See Income Report
                </StatHelpText>
              </Link>
            </Stat>
          </Box>
        </Tooltip>
      </button>
      {activeForm === "income" && (
        <Box gridColumn="1 / 4" gridRowStart="2">
          <IncomeForm />
        </Box>
      )}

      <button
        onMouseOver={() => setIsExpenseHovered(true)}
        onMouseOut={() => setIsExpenseHovered(false)}
        onClick={handleExpenseClick}
      >
        <Tooltip
          isOpen={showExpenseTooltip || isExpenseHovered}
          hasArrow
          bg="gray.600"
          color="white"
          label="Click on me to add an expense!"
          openDelay={500}
          closeDelay={200}
          placement="bottom"
          aria-label="Tooltip to let you know that if you click on this expense box, you can access the expense form and add an expense."
        >
          <Box
            {...(isExpenseHovered ? hoveredBoxStyle : boxStyle)}
            gridColumn={activeForm === "expense" ? "3 / 5" : "2 / 3"}
            onMouseOver={() => setIsExpenseHovered(true)}
            onMouseOut={() => setIsExpenseHovered(false)}
            onClick={handleExpenseClick}
            className="arrow-container"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <Stat>
              <StatLabel fontSize="lg" pt={12}>
                Expenses | {month} {year}
              </StatLabel>
              <StatNumber fontSize="2xl">{formattedTotalExpense}</StatNumber>
              <Link to="/reports?animate=expense">
                <StatHelpText
                  fontSize="md"
                  style={{ fontWeight: "600", marginTop: "5px" }}
                >
                  See Expense Report
                </StatHelpText>
              </Link>
            </Stat>
          </Box>
        </Tooltip>
      </button>
      {activeForm === "expense" && (
        <Box gridColumn="1 / 4" gridRowStart="2">
          <ExpenseForm />
        </Box>
      )}

      <button>
        <Box
          as="button"
          {...boxStyle}
          w="full"
          justifySelf="center"
          gridColumn="3 / 4"
          className="arrow-container"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Stat>
            <StatLabel fontSize="lg" pt={12}>
              Balance | {month} {year}
            </StatLabel>
            <StatNumber fontSize="2xl">{formattedBalance}</StatNumber>
            <Link to="/reports?animate=balance">
              <Tooltip
                hasArrow
                bg="gray.600"
                color="white"
                label="Click on me to see your monthly balance!"
                openDelay={500}
                closeDelay={200}
                placement="bottom"
                aria-label="Tooltip to let you know that if you click on this link, you can access your monthly balance graph."
              >
                <StatHelpText
                  fontSize="md"
                  style={{ fontWeight: "600", marginTop: "5px" }}
                >
                  See Balance Report
                </StatHelpText>
              </Tooltip>
            </Link>
          </Stat>
        </Box>
      </button>
    </SimpleGrid>
  );
}
