import React from "react";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./Index";
import Grid from "./Grid";
import Show from "./Show";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/:id" element={<Show />} />
      </Routes>
    </div>
  );
};

export default App;
