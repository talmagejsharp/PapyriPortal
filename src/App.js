// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PapyriPage from "./pages/PapyriPage";
import PapyrusPage from "./pages/PapyrusPage";
import CreatePapyrusPage from "./pages/CreatePapyrusPage";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/papri">View Papyri</Link> | 
        <Link to="/create">Create Papyrus</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/papri" element={<PapyriPage />} />
        <Route path="/papyrus/:id" element={<PapyrusPage />} />
        <Route path="/create" element={<CreatePapyrusPage />} />
      </Routes>
    </Router>
  );
}

export default App;
