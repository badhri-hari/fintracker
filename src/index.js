import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "./components/settings/ThemeContext";
import { Analytics } from "@vercel/analytics/react";

import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import "./styles/stylesheet.css";
import "./styles/index.css";

export default function App() {
  return (
    <ChakraProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="home" element={<Home />} />
            <Route path="budget" element={<Budget />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Analytics />
        </Router>
      </ThemeProvider>
    </ChakraProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
