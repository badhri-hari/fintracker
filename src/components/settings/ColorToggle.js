import React, { useContext, useEffect } from "react";
import { Switch, useColorMode } from "@chakra-ui/react";
import { ThemeContext } from "./ThemeContext";

export default function ColorToggle() {
  const { colorMode, setColorMode } = useContext(ThemeContext);
  const { colorMode: chakraColorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode !== chakraColorMode) {
      toggleColorMode();
    }
  }, [colorMode, chakraColorMode, toggleColorMode]);

  const toggleTheme = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

 return (
     <Switch
       isChecked={colorMode === "dark"}
       onChange={toggleTheme}
       width="100%"
       padding="15px"
       borderWidth="2px"
       borderRadius="10px"
       borderColor="gray.500"
       aria-label="Toggle Dark Mode"
     >
       Switch to {colorMode === "light" ? "Dark" : "Light"} Mode <i>(added post-IB)</i>
     </Switch>
 );
}
