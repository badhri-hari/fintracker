import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { Flex, Box, VStack } from "@chakra-ui/react";

import News from "../components/finhub/News";
import Stocks from "../components/finhub/Stocks";
import Forex from "../components/finhub/Forex";

import { ThemeContext } from "../components/settings/ThemeContext";

export default function Finhub() {
  const { colorMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        navigate("/");
      }
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <Flex
      h="90vh" // This sets the height of the Flex container to the full height of the viewport.
      p={4}
      direction={{ base: "column", md: "row" }} // Stacks components vertically on small screens, horizontally on medium+ screens.
      align="flex-start"
      bg={`${colorMode === "dark" ? "rgb(32,36,44)" : "gray.100"}`}
    >
      <VStack
        flex="1" // This will take up 1/3 of the space
        minWidth="33%" // Minimum width for the Stocks and Forex components
        spacing={4} // Space between Stocks and Forex components
        pr={4} // Add some padding-right for spacing
        height="full"
      >
        <Box w="100%" h="50%">
          <Stocks />
        </Box>
        <Box w="100%" h="50%">
          <Forex />
        </Box>
      </VStack>
      <Box
        flex="2" // This will take up 2/3 of the space
        minWidth="66%" // Minimum width for the News component
        overflowY="auto" // Add scroll to the News component
        height="full"
      >
        <News />
      </Box>
    </Flex>
  );
}
