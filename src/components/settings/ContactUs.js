import React from "react";
import { Button } from "@chakra-ui/react";

export default function ContactUs() {
  const handleContactClick = () => {
    const today = new Date().toISOString().split("T")[0];
    const mailto = `mailto:average.runner216@gmail.com?subject=Fintracker Software Issue Report | ${today} - INSERT EMAIL SUBJECT HERE`;
    window.open(mailto);
  };

  return (
    <Button mt="30px" onClick={handleContactClick} style={{ display: "none" }}>
      Contact Support
    </Button>
  );
}
