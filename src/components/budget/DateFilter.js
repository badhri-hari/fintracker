import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  VStack,
  FormControl,
  FormLabel,
  Button,
  Box,
  Heading,
  Divider,
} from "@chakra-ui/react";

import { ThemeContext } from "../settings/ThemeContext";

const DateFilter = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const { colorMode } = useContext(ThemeContext);

  const clearFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(null); // Reset end date if it's before the new start date
    }
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      alert("The end date cannot be before the start date.");
      return;
    }
    setEndDate(date);
  };

  return (
    <>
      <Box textAlign="center">
        <Heading size="md" mb="7.5px">
          By Date
        </Heading>
      </Box>
      <Divider
        my="4px"
        borderColor={colorMode === "dark" ? "gray.100" : "gray.700"}
      />
      <VStack spacing={4}>
        <FormControl id="start-date">
          <FormLabel mb="0px" mt="7.5px" fontSize="xs">
            Start Date
          </FormLabel>
          <DatePicker
            className={`${colorMode === "dark" ? "dark-datepicker" : ""}`}
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Start Date"
            dateFormat="MMMM d, yyyy"
          />
        </FormControl>
        <FormControl id="end-date">
          <FormLabel mb="0px" fontSize="xs">
            End Date
          </FormLabel>
          <DatePicker
            className={`${colorMode === "dark" ? "dark-datepicker" : ""}`}
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="End Date"
            dateFormat="MMMM d, yyyy"
            minDate={startDate} // Prevent end date before start date
            disabled={!startDate} // Disable end date picker until start date is selected
          />
        </FormControl>
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

export default DateFilter;
