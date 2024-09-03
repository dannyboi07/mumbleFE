import React from "react";
import { ToastProvider } from "./stitches-components/toastStyled";
import { StyledApp } from "./stitches-components/appStyled";
import { Routes, Route } from "react-router-dom";
import UnAuthRouter from "./components/UnAuthRouter";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import AuthRouter from "./components/AuthRouter";
import Home from "./components/Home/Home";
import ToastComp from "./components/Toast/ToastComp";
import "./App.css";

function App() {
    return (
        <ToastProvider swipeDirection="right">
            <StyledApp>
                <Routes>
                    <Route path="/auth" element={<UnAuthRouter />}>
                        <Route path="/auth/register" element={<Register />} />
                        <Route path="/auth/login" element={<Login />} />
                    </Route>
                    <Route path="/" element={<AuthRouter />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                </Routes>
            </StyledApp>
            <ToastComp />
        </ToastProvider>
    );
}

export default App;
