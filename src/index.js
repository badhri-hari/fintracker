import * as React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ChakraProvider, Skeleton } from "@chakra-ui/react";
import { ThemeProvider } from "./components/settings/ThemeContext";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { LoadingProvider } from "./contexts/LoadingContext";

import Header from "./components/header/Header";
import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import "./styles/stylesheet.css";
import "./styles/index.css";

function AnimatedRoutes() {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);

  const pageTransitionSkeleton = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
  };

  React.useEffect(() => {
    setIsLoading(true);
    pageTransitionSkeleton();
  }, [location]);

  return (
    <TransitionGroup>
      {location.pathname !== "/" && <Header />}
      <CSSTransition key={location.key} timeout={450}>
        {isLoading ? (
          <Skeleton height="100vh" />
        ) : (
          <Routes location={location}>
            <Route path="/" element={<SignIn />} />
            <Route path="home" element={<Home />} />
            <Route path="budget" element={<Budget />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Home />} />
          </Routes>
        )}
      </CSSTransition>
    </TransitionGroup>
  );
}

export default function App() {
  return (
    <ChakraProvider>
      <ThemeProvider>
        <BrowserRouter>
          <LoadingProvider>
            <AnimatedRoutes />
          </LoadingProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
