import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Slide } from "./screens/Slide";
import Login from "./screens/Auth/Login";
import SignUp from "./screens/Auth/SignUp";
import AccountValidation from "./screens/AccountValidation";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Slide />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account-validation" element={<AccountValidation />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
