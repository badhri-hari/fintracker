import React, { useState, useContext } from "react";
import {
  Radio,
  RadioGroup,
  Stack,
  Button,
  Heading,
  Divider,
  Box,
  VStack,
} from "@chakra-ui/react";

import { ThemeContext } from "../settings/ThemeContext";

const TransactionFilter = ({ onFilterChange }) => {
  const { colorMode } = useContext(ThemeContext);
  const [value, setValue] = useState("");

  const handleChange = (nextValue) => {
    setValue(nextValue);
    onFilterChange(nextValue);
  };

  const clearFilter = () => {
    setValue("");
    onFilterChange("");
  };

  return (
    <>
      <Box textAlign="center">
        <Heading size="md" mb="7.5px">
          By transaction type
        </Heading>
      </Box>
      <Divider
        my="4px"
        borderColor={colorMode === "dark" ? "gray.100" : "gray.700"}
      />
      <RadioGroup mt="7.5px" mb={"2px"} onChange={handleChange} value={value}>
        <Stack direction="column">
          <Radio value="income">Income</Radio>
          <Radio value="expenses">Expenses</Radio>
        </Stack>
      </RadioGroup>
      <VStack spacing="4">
        <Button
          onClick={clearFilter}
          size="sm"
          mt="2"
          bg={`${colorMode === "dark" ? "rgb(100, 100, 100)" : "gray.200"}`}
        >
          Clear Filter
        </Button>
      </VStack>
    </>
  );
};

export default TransactionFilter;
