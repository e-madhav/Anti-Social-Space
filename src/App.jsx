import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Todo from './pages/Todo';
import Routine from './pages/Routine';
import Planning from './pages/Planning';
import PlanEditor from './pages/PlanEditor'; // <--- 1. IMPORT THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<Notes />} />
          
          {/* Planning Section */}
          <Route path="planning" element={<Planning />} />
          <Route path="planning/:id" element={<PlanEditor />} /> {/* <--- 2. ADD THIS ROUTE */}
          
          <Route path="routine" element={<Routine />} />
          <Route path="todo" element={<Todo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;