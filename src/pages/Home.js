import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { Divider, Heading, Box } from "@chakra-ui/react";

import BudgetInfoCards from "../components/home/BudgetInfoCards";
import RecentTransactionsTable from "../components/home/RecentTransactionsTable";

export default function Home() {
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName("Welcome " + user.displayName + "!");
      } else {
        navigate("/");
      }
    });
    return unsubscribe;
  }, [navigate]);

  return (
    <>
      <Heading as="h2" size="xl" ml="20px" mt="18px" mb="18px">
        {displayName}
      </Heading>
      <Divider />
      <br />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="full"
      >
        <BudgetInfoCards />
      </Box>
      <br />
      <Divider mt="30px" width="95%" ml="2%" borderColor="gray.500" />
      <RecentTransactionsTable />
    </>
  );
}
