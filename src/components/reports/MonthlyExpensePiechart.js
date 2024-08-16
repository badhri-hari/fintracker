import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { Heading, Box, Divider, Flex, Select } from "@chakra-ui/react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  Tooltip as ChartTooltip,
} from "chart.js";

import { ThemeContext } from "../settings/ThemeContext";

ChartJS.register(ArcElement, Legend, ChartTooltip);

export default function MonthlyExpensePiechart({ year }) {
  const { colorMode } = useContext(ThemeContext);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
    setShowDropdown(false);
  };
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#af4c50", "#c38b4a", "#dccd39", "#bb666a"],
      },
    ],
  });

  useEffect(() => {
    const startOfMonth = new Date(year, selectedMonth, 1);
    const endOfMonth = new Date(year, selectedMonth + 1, 0);

    const fetchCategoriesAndTransactions = async () => {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      const categories = {};
      categoriesSnapshot.forEach((doc) => {
        categories[doc.id] = doc.data().name;
      });

      const transactionsRef = query(
        collection(db, "transactions"),
        where("userId", "==", auth?.currentUser?.uid),
        where("dateAdded", ">=", startOfMonth),
        where("dateAdded", "<=", endOfMonth)
      );

      const unsubscribeFirestore = onSnapshot(transactionsRef, (snapshot) => {
        const amountsByCategory = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.amount < 0) {
            const categoryName = categories[data.categoryId] || "Uncategorized";
            amountsByCategory[categoryName] =
              (amountsByCategory[categoryName] || 0) + Math.abs(data.amount);
          }
        });

        const chartCategories = Object.keys(amountsByCategory);
        const amounts = chartCategories.map(
          (category) => amountsByCategory[category]
        );

        const newChartData = {
          labels: chartCategories,
          datasets: [
            {
              data: amounts,
              backgroundColor: ["#af4c50", "#c38b4a", "#dccd39", "#bb666a"],
            },
          ],
        };

        setChartData(newChartData);
      });

      return () => {
        unsubscribeFirestore();
      };
    };

    fetchCategoriesAndTransactions();
  }, [selectedMonth, year]);

  const currentMonthName = months[selectedMonth];

  return (
    <>
      <Box marginLeft="30px" marginTop="30px">
        <Box
          bg={`${colorMode === "dark" ? "rgb(150, 150, 150)" : "gray.100"}`}
          p="4"
          borderRadius="md"
          flex="1"
          h="100%"
          width="20rem"
          height="20rem"
        >
          <Flex position="relative" alignItems="center" margin="3">
            <Divider borderColor="black" />
            <Heading
              color={`${colorMode === "dark" ? "white" : ""}`}
              bg={`${colorMode === "dark" ? "rgb(150, 150, 150)" : "gray.100"}`}
              size="md"
              position="absolute"
              left="50%"
              transform="translateX(-50%)"
              zIndex="1"
              onClick={toggleDropdown}
              px="12px"
              pb="1px"
              whiteSpace="nowrap"
            >
              Expense Categories | {currentMonthName}
            </Heading>
            <Select
              position="absolute"
              left="50%"
              transform="translateX(-50%) translateY(-50%)"
              top="0"
              zIndex="2"
              cursor="pointer"
              onChange={handleMonthChange}
              value={selectedMonth}
              width="auto"
              minWidth="200px"
              placeholder=" "
              icon="{styles={marginRight: auto}}"
              sx={{
                border: "none",
                boxShadow: "none",
                "&:focus": { outline: "none", boxShadow: "none" },
              }}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {selectedMonth === index ? "" : month}{" "}
                </option>
              ))}
            </Select>
          </Flex>
          <Box mt="9%" height="85%" borderWidth={"1px"} borderColor={"black"}>
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
