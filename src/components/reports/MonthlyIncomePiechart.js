import React, { useEffect, useState, useContext } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { Heading, Box, Divider, Flex, Select, Tooltip } from "@chakra-ui/react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  Tooltip as ChartTooltip,
} from "chart.js";

import { ThemeContext } from "../settings/ThemeContext";

ChartJS.register(ArcElement, Legend, ChartTooltip);

export default function MonthlyIncomePiechart({ year }) {
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
        backgroundColor: ["#4CAF50", "#8BC34A", "#CDDC39", "#66BB6A"],
      },
    ],
  });

  const isCurrentMonth = (date) => {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  };

  useEffect(() => {
    const transactionsRef = query(
      collection(db, "transactions"),
      where("userId", "==", auth?.currentUser?.uid)
    );
    const startOfMonth = new Date(year, selectedMonth, 1);
    const endOfMonth = new Date(year, selectedMonth + 1, 0);

    const q = query(
      transactionsRef,
      where("userId", "==", auth?.currentUser?.uid),
      where(
        "dateAdded",
        ">=",
        new Date(new Date().getFullYear(), selectedMonth, 1)
      ),
      where(
        "dateAdded",
        "<",
        new Date(new Date().getFullYear(), selectedMonth + 1, 1)
      ),
      where("dateAdded", ">=", startOfMonth),
      where("dateAdded", "<=", endOfMonth)
    );

    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const amountsByCategory = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.amount > 0 && isCurrentMonth(data.dateAdded.toDate())) {
          amountsByCategory[data.categoryName] =
            (amountsByCategory[data.categoryName] || 0) + data.amount;
        }
      });

      const categories = Object.keys(amountsByCategory);
      const amounts = categories.map((category) => amountsByCategory[category]);

      const newChartData = {
        labels: categories,
        datasets: [
          {
            data: amounts,
            backgroundColor: ["#4CAF50", "#8BC34A", "#CDDC39", "#66BB6A"],
          },
        ],
      };

      setChartData(newChartData);
    });

    return () => {
      unsubscribeFirestore();
    };
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
            <Tooltip
              hasArrow
              bg="gray.600"
              color="white"
              label="Double click on me to filter by months!"
              openDelay={400}
              closeDelay={50}
              placement="top"
              aria-label="Tooltip to let you know that if you click on this menu, you can see the options to edit or delete this specific transaction."
            >
              <Heading
                color={`${colorMode === "dark" ? "white" : ""}`}
                bg={`${
                  colorMode === "dark" ? "rgb(150, 150, 150)" : "gray.100"
                }`}
                size="md"
                position="absolute"
                left="50%"
                transform="translateX(-50%)"
                zIndex="1"
                onClick={toggleDropdown}
                cursor="pointer"
                px="12px"
                pb="1px"
                whiteSpace="nowrap"
              >
                Income Categories | {currentMonthName}
              </Heading>
            </Tooltip>
            {showDropdown && (
              <Select
                position="absolute"
                left="50%"
                transform="translateX(-50%) translateY(-50%)"
                top="0"
                zIndex="2"
                onChange={handleMonthChange}
                onBlur={() => setShowDropdown(false)}
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
                    {month}
                  </option>
                ))}
              </Select>
            )}
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
