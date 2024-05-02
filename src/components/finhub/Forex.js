import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Select,
  Button,
  SimpleGrid,
  useToast,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { ThemeContext } from "../settings/ThemeContext";

export default function Forex() {
  const toast = useToast();
  const { colorMode } = useContext(ThemeContext);
  const textColor = colorMode === "dark" ? "white" : "gray.800";
  const bgColor = colorMode === "dark" ? "gray.700" : "gray.100";
  const [currencies, setCurrencies] = useState([]);
  const [toCurrency, setToCurrency] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`http://localhost:3001/currencies/api`);
      const currenciesData = await response.json();
      setCurrencies(currenciesData);
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
    }
  };

  const fetchForexData = async () => {
    if (!fromCurrency || !toCurrency) {
      toast({
        title: "Oops!",
        description: "Please select both currencies!",
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
        `http://localhost:3001/forex/api?from_currency=${fromCurrency}&to_currency=${toCurrency}`
      );
      const data = await response.json();
      setExchangeRate(data.exchange_rate);
    } catch (err) {
      toast({
        title: "Uh oh!",
        description: "Failed to fetch forex data. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "left-accent",
      });
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const findCurrencyNameByCode = (code) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.name : "";
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
          <Select
            placeholder="Select Currency 1"
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
            borderWidth="1px"
            borderColor="black"
            mb="1"
          >
            {currencies.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select Currency 2"
            value={toCurrency}
            onChange={handleToCurrencyChange}
            borderWidth="1px"
            borderColor="black"
          >
            {currencies.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Select>
          <Button onClick={fetchForexData} mt="4" ml="27.5%">
            Get Exchange Rate
          </Button>
          {isLoading ? (
            <Skeleton height="100px" m="2" mt="5" borderRadius="md" />
          ) : (
            exchangeRate && (
              <Box
                height="100px"
                bg={bgColor}
                p="4"
                m="2"
                mt="5"
                borderRadius="md"
                boxShadow="md"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Stat>
                  <StatLabel color={textColor} textAlign="center">
                    Latest exchange rate from{" "}
                    {findCurrencyNameByCode(fromCurrency)} ({fromCurrency}) to{" "}
                    {findCurrencyNameByCode(toCurrency)} ({toCurrency}):
                  </StatLabel>
                  <StatNumber color={textColor} textAlign="center">
                    {exchangeRate}
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
