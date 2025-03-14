import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { Heading, Box, VStack, Divider, Flex } from "@chakra-ui/react";

import CategoryTable from "../components/settings/CategoryTable";
import ColorToggle from "../components/settings/ColorToggle";
import Header from "../components/header/Header";

export default function Settings() {
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
    <>
      <Header />
      <Flex direction="column" minHeight="90.5vh">
        <Box flex="1">
          <Heading as="h2" size="xl" ml="20px" mt="18px" mb="18px">
            Settings
          </Heading>
          <Divider />
          <Box
            w="100%"
            maxW={{ base: "100%", md: "30%" }}
            mx="left"
            ml="15px"
            mt="30px"
          >
            <VStack align="stretch" spacing="20px">
              <CategoryTable />
              <ColorToggle />
            </VStack>
          </Box>
        </Box>
        <footer
          style={{
            textAlign: "center",
            width: "100%",
            backgroundColor: "transparent",
            marginBottom: "25px",
          }}
        ><a href="https://github.com/badhri-hari" target="_blank" rel="noreferrer">:D</a></footer>
      </Flex>
    </>
  );
}
