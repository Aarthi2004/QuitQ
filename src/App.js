import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
// import other pages like ResetPassword if needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Add more routes here, for example: */}
      {/* <Route path="/resetpassword" element={<ResetPassword />} /> */}
    </Routes>
  );
}

export default App;
