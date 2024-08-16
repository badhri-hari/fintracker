import React, { useEffect, useState, useContext } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { Box, Flex, Heading, Select, Divider } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip as ChartTooltip,
} from "chart.js";

import { ThemeContext } from "../settings/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  ChartTooltip
);

export default function MonthlyIncomeGraph({ shouldAnimate, year }) {
  const animationClass = shouldAnimate ? "scale-animation" : "";
  const { colorMode } = useContext(ThemeContext);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
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

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: "rgb(230, 230, 44)",
        borderColor: "rgb(230, 230, 44)",
      },
    ],
  });

  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const startOfMonth = new Date(year, selectedMonth, 1);
    const endOfMonth = new Date(year, selectedMonth + 1, 0);
    const transactionsRef = collection(db, "transactions");

    const monthTransactions = query(
      transactionsRef,
      where("userId", "==", auth.currentUser.uid),
      where("dateAdded", ">=", startOfMonth),
      where("dateAdded", "<=", endOfMonth)
    );

    const unsubscribeFirestore = onSnapshot(monthTransactions, (snapshot) => {
      const dailyBalances = {};
      let runningTotal = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.dateAdded.toDate();
        const formattedDate = date.toISOString().split("T")[0];
        dailyBalances[formattedDate] =
          (dailyBalances[formattedDate] || 0) + data.amount;
      });

      const sortedDates = Object.keys(dailyBalances).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      const cumulativeData = sortedDates.map((date) => {
        runningTotal += dailyBalances[date];
        return runningTotal;
      });

      setChartData({
        labels: sortedDates,
        datasets: [
          {
            data: cumulativeData,
            backgroundColor: "rgb(230, 230, 44)",
            borderColor: "rgb(230, 230, 44)",
          },
        ],
      });
    });

    return () => unsubscribeFirestore();
  }, [selectedMonth, year]);

  return (
    <Box marginLeft="30px" marginTop="30px" className={animationClass}>
      <Box
        bg={colorMode === "dark" ? "rgb(150, 150, 150)" : "gray.100"}
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
            px="12px"
            pb="1px"
            whiteSpace="nowrap"
          >
            {months[selectedMonth]} Balances
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
        <Box pt="3%" mt="9%" height="85%" borderWidth="1px" borderColor="black">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  display: true,
                  grid: {
                    drawOnChartArea: true,
                  },
                },
                x: {
                  display: true,
                  grid: {
                    drawOnChartArea: true,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
