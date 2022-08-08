import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoginBg, LoginForm } from "../../stitches-components/loginStyled";
import {
	StyledInput as Input,
	StyledButton as Button,
	StyledLabel,
	labelStyle,
} from "../../stitches-components/commonStyled";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/userSlice";
import { setToast } from "../../slices/toastSlice";

function Login() {
	const dispatch = useDispatch();
	const [userDetails, setUserDetails] = useState({
		email: "",
		password: "",
	});

	useEffect(() => {
		document.title = "Mumble | Login";
	}, []);

	function handleDetailChange(e) {
		setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (
			userDetails.email.trim() !== "" &&
			userDetails.password.trim() !== ""
		) {
			// const user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone
			fetch(`https://${process.env.REACT_APP_BACKEND_DOM_API}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					email: userDetails.email,
					password: userDetails.password,
					// user_tz
				}),
			}).then((response) => {
				if (response.status === 200) {
					response.json().then((resJson) => {
						dispatch(setUser(resJson));
						localStorage.setItem(
							"mumble-user",
							JSON.stringify(resJson),
						);
						dispatch(
							setToast({
								type: "suc",
								title: "Logged in",
							}),
						);
					});
				} else {
					response.text().then((resText) =>
						dispatch(
							setToast({
								type: "err",
								title: resText,
							}),
						),
					);
				}
			});
		}
	}

	return (
		<LoginBg>
			<h1>Login</h1>
			<LoginForm onSubmit={handleSubmit}>
				<StyledLabel
					css={userDetails.email.length > 0 && labelStyle}
					kind={"email"}
				>
					<Input
						name="email"
						type="email"
						value={userDetails.email}
						onChange={handleDetailChange}
						required
					/>
				</StyledLabel>
				<StyledLabel
					css={userDetails.password.length > 0 && labelStyle}
					kind={"pw"}
				>
					<Input
						name="password"
						type="password"
						value={userDetails.password}
						onChange={handleDetailChange}
						required
					/>
				</StyledLabel>

				<Button
					type="submit"
					css={{
						cursor: "pointer",
					}}
				>
					Login
				</Button>

				<Link
					style={{
						alignSelf: "center",
					}}
					to={"/auth/register"}
					replace={true}
				>
					Click here to sign up
				</Link>
			</LoginForm>
		</LoginBg>
	);
}

export default Login;
