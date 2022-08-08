import React from "react";
import { Routes, Route } from "react-router-dom";
import { StyledApp } from "./stitches-components/appStyled";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import { ToastProvider } from "./stitches-components/toastStyled";
import ToastComp from "./components/Toast/ToastComp";
import "./App.css";
import AuthRouter from "./components/AuthRouter";
import UnAuthRouter from "./components/UnAuthRouter";
import Home from "./components/Home/Home";

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
