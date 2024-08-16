import React, { useState, useContext } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Button,
  Input,
  Box,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { ThemeContext } from "../settings/ThemeContext";

const AmountFilter = ({ onFilterChange }) => {
  const { colorMode } = useContext(ThemeContext);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const handleFilterChange = () => {
    onFilterChange(minAmount, maxAmount);
  };

  const clearFilter = () => {
    setMinAmount("");
    setMaxAmount("");
    onFilterChange("", "");
  };

  const handleMinAmountChange = (e) => {
    const input = e.target.value;
    let sanitizedValue = input.replace(/[^0-9-]/g, "");
    const hyphenCount = (sanitizedValue.match(/-/g) || []).length;
    if (hyphenCount > 1) {
      sanitizedValue = sanitizedValue.replace(/-/g, "");
      sanitizedValue = "-" + sanitizedValue;
    }
    if (sanitizedValue.includes("-") && sanitizedValue.indexOf("-") > 0) {
      sanitizedValue = "-" + sanitizedValue.replace(/-/g, "");
    }
    setMinAmount(sanitizedValue);
  };

  const handleMaxAmountChange = (e) => {
    const input = e.target.value;
    let sanitizedValue = input.replace(/[^0-9-]/g, "");
    const hyphenCount = (sanitizedValue.match(/-/g) || []).length;
    if (hyphenCount > 1) {
      sanitizedValue = sanitizedValue.replace(/-/g, "");
      sanitizedValue = "-" + sanitizedValue;
    }
    if (sanitizedValue.includes("-") && sanitizedValue.indexOf("-") > 0) {
      sanitizedValue = "-" + sanitizedValue.replace(/-/g, "");
    }
    setMaxAmount(sanitizedValue);
  };

  return (
    <>
      <Box textAlign="center">
        <Heading size="md" mb="7.5px">
          By Amount
        </Heading>
      </Box>
      <Divider
        my="4px"
        borderColor={colorMode === "dark" ? "gray.100" : "gray.700"}
      />
      <VStack spacing={4}>
        <FormControl id="min-amount">
          <FormLabel mb="0px" mt="7.5px" fontSize="xs">
            Min Amount
          </FormLabel>
          <Input
            bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : ""}`}
            value={minAmount}
            onChange={handleMinAmountChange}
            placeholder="Min Amount"
          />
        </FormControl>
        <FormControl id="max-amount">
          <FormLabel mb="0px" fontSize="xs">
            Max Amount
          </FormLabel>
          <Input
            bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : ""}`}
            value={maxAmount}
            onChange={handleMaxAmountChange}
            placeholder="Max Amount"
          />
        </FormControl>
        <Button
          onClick={handleFilterChange}
          size="sm"
          mt="2"
          bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : "gray.200"}`}
        >
          Apply Filter
        </Button>
        <Button
          onClick={clearFilter}
          size="sm"
          bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : "gray.200"}`}
        >
          Clear Filter
        </Button>
      </VStack>
    </>
  );
};

export default AmountFilter;
