import React from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import ResultsPage from "./pages/ResultsPage";

const App: React.FC = () => {

  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route
                path="/"
                element={<HomePage />}
            />
            <Route
                path="/results"
                element={<ResultsPage />}
            />
        </Routes>
    </BrowserRouter>
</>
  );
};

export default App;
