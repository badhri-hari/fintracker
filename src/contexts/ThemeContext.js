import React, { createContext, useState } from "react";

export const ThemeContext = createContext({
  colorMode: "light",
  setColorMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState("dark");

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
