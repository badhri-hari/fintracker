import React, { useContext, useState } from "react";
import {
  Box,
  Input,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  SimpleGrid,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";

import { ThemeContext } from "../settings/ThemeContext";

export default function Stocks() {
  const toast = useToast();

  const { colorMode } = useContext(ThemeContext);
  const textColor = colorMode === "dark" ? "white" : "gray.800";
  const bgColor = colorMode === "dark" ? "gray.700" : "gray.100";
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStockData = async () => {
    if (!symbol) {
      toast({
        title: "Oops!",
        description: "Please provide a valid stock symbol!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/stocks/api?symbol=${symbol}`
      );
      const data = await response.json();
      setStockData(data);
    } catch (err) {
      toast({
        title: "Uh oh!",
        description: "Failed to fetch stock data. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setSymbol(e.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      height="100%"
      p="10px"
      borderRadius="20px"
    >
      <SimpleGrid
        height="100%"
        width="100%"
        templateRows="1fr"
        templateColumns="1fr"
        gap={4}
      >
        <Box
          bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : "white"}`}
          borderColor="white"
          borderRadius="20px"
          p="10px"
          flex={1}
          h="100%"
        >
          <Input
            placeholder="Enter Stock Symbol (e.g., AAPL)"
            value={symbol}
            onChange={handleInputChange}
            borderWidth="1px"
            borderColor="black"
          />
          <Button onClick={fetchStockData} mt="4" ml="30%">
            Get Stock Data
          </Button>
          {isLoading ? (
            <Skeleton height="130px" m="2" mt="4" borderRadius="md" />
          ) : (
            stockData && (
              <Box
                height="130px"
                bg={bgColor}
                p="4"
                m="2"
                mt="4"
                borderRadius="md"
                boxShadow="md"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Stat>
                  <StatLabel color={textColor}>{stockData.symbol}</StatLabel>
                  <StatNumber color={textColor}>
                    ${stockData.latestClose}
                    {stockData.status === "down" && (
                      <StatArrow ml="1.5" type="decrease" />
                    )}
                    {stockData.status === "up" && (
                      <StatArrow ml="1.5" type="increase" />
                    )}
                    {stockData.status === "unchanged" && <MinusIcon ml="1.5" />}
                  </StatNumber>
                </Stat>
              </Box>
            )
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
